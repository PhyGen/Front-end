import React, { useState, useRef, useEffect } from 'react';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import api from '@/config/axios';
import RichTextRenderer from './RichTextRenderer';

const BOT_NAME = "PhyBot";
const BOT_AVATAR = "/src/assets/icons/phygen-icon.png";

// ⚙️ Hàm xử lý LaTeX và Markdown thành HTML với tag KaTeX
function convertLatexToHTML(rawText) {
  if (!rawText) return '';

  // Convert LaTeX block \[...\]
  let html = rawText.replace(/\\\[(.+?)\\\]/gs, (_, latex) => {
    return `<div data-math-inline value="${latex.trim()}"></div>`;
  });

  // Convert LaTeX inline \(...\)
  html = html.replace(/\\\((.+?)\\\)/g, (_, latex) => {
    return `<span data-math-inline value="${latex.trim()}"></span>`;
  });

  // Convert bold **...**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Chuyển xuống dòng nếu có nhiều dòng
  html = html.replace(/\n/g, '<br/>');

  return html;
}

const PhyBotChatBox = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      position: 'left',
      type: 'text',
      text: `Xin chào! Tôi là ${BOT_NAME}. Bạn cần hỗ trợ gì?`,
      date: new Date(),
      title: BOT_NAME,
      avatar: BOT_AVATAR,
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (visible && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, visible]);


  const handleSend = async () => {
    if (!input.trim()) return;

    // Message từ người dùng
    const userMsg = {
      position: 'right',
      type: 'text',
      text: input,
      date: new Date(),
      title: 'Bạn',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await api.post('/deepseek/chat', { message: input });
      const botReplyRaw = res.data?.response || "Xin lỗi, tôi chưa hiểu ý bạn.";

      // Chuyển sang HTML có data-math-inline để KaTeX xử lý
      const botReplyHTML = convertLatexToHTML(botReplyRaw);
      const containsMath = botReplyHTML.includes('data-math-inline');

      const botMsg = {
        position: 'left',
        type: containsMath ? 'custom' : 'text',
        ...(containsMath
          ? { html: botReplyHTML, isHTML: true }
          : { text: botReplyRaw }),
        date: new Date(),
        title: BOT_NAME,
        avatar: BOT_AVATAR,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          position: 'left',
          type: 'text',
          text: "Có lỗi xảy ra, vui lòng thử lại sau.",
          date: new Date(),
          title: BOT_NAME,
          avatar: BOT_AVATAR,
        }
      ]);
    }
  };

  return (
    <>
      {/* Nút mở chat hình tròn */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}>
        {!visible && (
          <button
            onClick={() => setVisible(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#2563eb',
              border: 'none',
              boxShadow: '0 2px 8px #0002',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Chat với PhyBot"
          >
            <img src={BOT_AVATAR} alt="bot" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          </button>
        )}
      </div>

      {/* Khung chat */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 340,
            maxWidth: '90vw',
            height: '50vh',
            minHeight: 320,
            maxHeight: '80vh',
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 24px #0003',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{ background: '#2563eb', color: 'white', padding: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src={BOT_AVATAR} alt="bot" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
            <span style={{ fontSize: 16 }}>{BOT_NAME}</span>
            <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>&times;</button>
          </div>

          {/* Danh sách tin nhắn */}
          <div style={{ flex: 1, padding: 12, overflowY: 'auto', background: '#f8fafc' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                {msg.isHTML ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <img
                      src={msg.avatar}
                      alt="bot"
                      style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
                    />
                    <div
                      style={{
                        background: '#e0e7ff',
                        borderRadius: 12,
                        padding: '8px 12px',
                        maxWidth: '80%',
                        fontSize: 14
                      }}
                    >
                      <RichTextRenderer html={msg.html} />
                    </div>
                  </div>
                ) : (
                  <MessageBox {...msg} />
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Thanh nhập liệu */}
          <div style={{ padding: 12, borderTop: '1px solid #e5e7eb', background: '#fff' }}>
            <Input
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              inputStyle={{
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                padding: '8px',
                fontSize: '16px',
                outline: 'none',
                color: '#000',
              }}
              rightButtons={
                <Button
                  text="Gửi"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  color="white"
                  backgroundColor="#2563eb"
                  style={{ borderRadius: 16, fontWeight: 600 }}
                  buttonRef={null}
                />
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PhyBotChatBox;
