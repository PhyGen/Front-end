import React, { useState, useRef, useEffect } from 'react';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import api from '@/config/axios';
const BOT_NAME = "PhyBot";
const BOT_AVATAR = "/src/assets/icons/phygen-icon.png";

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
    const userMsg = {
      position: 'right',
      type: 'text',
      text: input,
      date: new Date(),
      title: 'Bạn',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Gửi message đến backend
    try {
      const res = await api.post('/gemini-25/chat', { message: input });
      const botReply = res.data?.reply || "Xin lỗi, tôi chưa hiểu ý bạn.";
      setMessages(prev => [
        ...prev,
        {
          position: 'left',
          type: 'text',
          text: botReply,
          date: new Date(),
          title: BOT_NAME,
          avatar: BOT_AVATAR,
        }
      ]);
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
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 9999,
        }}
      >
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
            height: '50vh', // Chiều cao cố định
            minHeight: 320,
            maxHeight: '80vh',
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 24px #0003',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Không dùng overflowY ở ngoài cùng
          }}
        >
          <div style={{ background: '#2563eb', color: 'white', padding: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img
                src={BOT_AVATAR}
                alt="bot"
                style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
            />
            <span style={{ fontSize: 16 }}>{BOT_NAME}</span>
            <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>&times;</button>
          </div>
          <div style={{ flex: 1, padding: 12, overflowY: 'auto', background: '#f8fafc' }}>
            {messages.map((msg, idx) => (
              <MessageBox key={idx} {...msg} />
            ))}
            <div ref={chatEndRef} />
          </div>
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