import React, { useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { MathfieldElement } from 'mathlive';
import { Node } from '@tiptap/core';
import { TextStyle } from '@tiptap/extension-text-style';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

// Custom math extension
const MathInlineComponent = (props) => {
  const { node, selected } = props;
  const latex = node.attrs.value || '';
  return (
    <NodeViewWrapper
      as="span"
      data-math-inline=""
      style={{
        background: '#f0f0f0',
        padding: '2px 4px',
        borderRadius: 3,
        outline: selected ? '2px solid #2563eb' : 'none'
      }}
    >
      <span
        dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError: false }) }}
      />
    </NodeViewWrapper>
  );
};

const MathInline = Node.create({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() {
    return {
      value: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'span[data-math-inline]' }];
  },
  renderHTML({ HTMLAttributes }) {
    // Không render KaTeX HTML vào content, chỉ tag đơn giản, KHÔNG có content hole
    return ['span', { ...HTMLAttributes, 'data-math-inline': '', value: HTMLAttributes.value }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(MathInlineComponent);
  },
  addCommands() {
    return {
      setMathInline:
        value =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { value } }),
    };
  },
});

const ToolbarButton = ({ onClick, active, children, title, style }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 rounded ${active ? 'bg-blue-200' : 'bg-slate-100'} hover:bg-blue-100 mx-1`}
    title={title}
    tabIndex={-1}
    style={style}
  >{children}</button>
);

export default function TiptapEditor({ value, onChange, placeholder }) {
  const [showMath, setShowMath] = useState(false);
  const [mathValue, setMathValue] = useState('');
  const mathFieldRef = useRef(null);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showBgColorInput, setShowBgColorInput] = useState(false);
  const [bgColor, setBgColor] = useState('#ffff00');
  const [linkAnchor, setLinkAnchor] = useState('');
  const [editingLink, setEditingLink] = useState(false);

  const lowlight = createLowlight(common);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      TextStyle, // Đảm bảo đứng trước Color
      Color.configure({ types: ['textStyle'] }),
      Highlight,
      Link.configure({ openOnClick: false }),
      Image,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      CodeBlockLowlight.configure({ lowlight }),
      MathInline,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { placeholder: placeholder || '' } },
  });

  const handleInsertMath = () => {
    if (mathValue && editor) {
      editor.chain().focus().setMathInline(mathValue).run();
      setShowMath(false);
      setMathValue('');
    }
  };

  const handleInsertImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setShowImageInput(false);
      setImageUrl('');
    }
  };

  const handleShowLinkInput = () => {
    if (!editor) return;
    const { state } = editor;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to, ' ');
    const linkMark = editor.getAttributes('link');
    if (editor.isActive('link')) {
      setLinkUrl(linkMark.href || '');
      setLinkAnchor(selectedText || linkMark.href || '');
      setEditingLink(true);
    } else {
      setLinkUrl('');
      setLinkAnchor(selectedText || '');
      setEditingLink(false);
    }
    setShowLinkInput(true);
  };

  useEffect(() => {
    if (showMath && mathFieldRef.current) {
      let mf = mathFieldRef.current.querySelector('math-field');
      if (!mf) {
        mf = document.createElement('math-field');
        mf.setOptions({ virtualKeyboardMode: 'onfocus', smartFence: true, smartMode: true });
        mf.addEventListener('input', () => setMathValue(mf.getValue('latex')));
        mathFieldRef.current.appendChild(mf);
      }
      mf.setValue(mathValue || '', { format: 'latex' });
      setTimeout(() => mf.focus(), 0);
    }
  }, [showMath, mathValue]);

  return (
    <div>
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap items-center gap-1 mb-2 bg-slate-50 p-2 rounded border">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="In đậm"><b>B</b></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="In nghiêng"><i>I</i></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gạch chân"><u>U</u></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Gạch ngang"><s>S</s></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight" style={{ background: '#ffe066' }}>H</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Danh sách chấm">•</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Danh sách số">1.</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">❝</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">{'</>'}</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Hoàn tác">↺</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Làm lại">↻</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">H1</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">H2</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">H3</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Căn trái">⬅</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Căn giữa">↔</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Căn phải">➡</ToolbarButton>
          <ToolbarButton onClick={handleShowLinkInput} active={editor.isActive('link')} title="Chèn link">🔗</ToolbarButton>
          <ToolbarButton onClick={() => setShowMath(true)} title="Chèn công thức toán học">Σ</ToolbarButton>
        </div>
      )}

      {/* Editor Content */}
      <div className="tiptap-editor" style={{ border: '1px solid #d1d5db', borderRadius: 6, minHeight: 80, background: 'white', padding: 8 }}>
        <EditorContent editor={editor} className="outline-none border-none shadow-none" />
      </div>

      {/* Math Input Popup */}
      {showMath && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-start justify-center" onMouseDown={e => e.target === e.currentTarget && setShowMath(false)}>
          <div className="bg-white rounded-lg p-6 mt-20 max-w-3xl w-4/5 relative">
            <h3 className="font-bold mb-4">Nhập công thức toán học</h3>
            <div ref={mathFieldRef} className="mathfield-container mb-4" />
            <div className="flex gap-2">
              <button type="button" onClick={handleInsertMath} className="bg-blue-500 text-white px-4 py-2 rounded">Chèn</button>
              <button type="button" onClick={() => setShowMath(false)} className="bg-gray-300 px-4 py-2 rounded">Hủy</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Bạn có thể dùng bàn phím ảo hoặc gõ trực tiếp LaTeX.</p>
          </div>
        </div>
      )}

      {/* Image & Link Popups omitted for brevity */}

      {/* Link Input Popup */}
      {showLinkInput && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center" onMouseDown={e => e.target === e.currentTarget && setShowLinkInput(false)}>
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-bold mb-4">{editingLink ? 'Sửa liên kết' : 'Chèn liên kết'}</h3>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Văn bản hiển thị"
              value={linkAnchor}
              onChange={e => setLinkAnchor(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mb-4"
              placeholder="Nhập URL..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!linkUrl) return;
                  if (editor.state.selection.empty) {
                    // Không có selection, chèn anchor mới
                    const anchor = linkAnchor || linkUrl;
                    const pos = editor.state.selection.from;
                    editor.chain().focus()
                      .insertContent({
                        type: 'text',
                        text: anchor,
                        marks: [{ type: 'link', attrs: { href: linkUrl } }]
                      })
                      .setTextSelection(pos + anchor.length) // Đặt con trỏ sau anchor text
                      .run();
                  } else {
                    // Có selection, thay thế hoặc cập nhật
                    const { from, to } = editor.state.selection;
                    editor.chain().focus()
                      .extendMarkRange('link')
                      .setLink({ href: linkUrl })
                      .setTextSelection(to) // Đặt con trỏ sau selection
                      .run();
                    if (linkAnchor && linkAnchor !== editor.state.doc.textBetween(from, to, ' ')) {
                      editor.chain().focus()
                        .insertContent(linkAnchor)
                        .setTextSelection(from + linkAnchor.length)
                        .run();
                    }
                  }
                  setShowLinkInput(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editingLink ? 'Cập nhật' : 'Chèn'}
              </button>
              {editingLink && (
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setShowLinkInput(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Bỏ liên kết
                </button>
              )}
              <button type="button" onClick={() => setShowLinkInput(false)} className="bg-gray-300 px-4 py-2 rounded">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Input Popup */}
      {showImageInput && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center" onMouseDown={e => e.target === e.currentTarget && setShowImageInput(false)}>
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="font-bold mb-4">Chèn ảnh</h3>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full mb-4"
              placeholder="Nhập URL ảnh..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <button type="button" onClick={handleInsertImage} className="bg-blue-500 text-white px-4 py-2 rounded">Chèn</button>
              <button type="button" onClick={() => setShowImageInput(false)} className="bg-gray-300 px-4 py-2 rounded">Hủy</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tiptap-editor .ProseMirror {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .tiptap-editor .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }
        .tiptap-editor .ProseMirror a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .mathfield-container {
          width: 100%;
          max-width: 800px;
          min-width: 400px;
          min-height: 200px;
          height: 250px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #f9fafb;
          padding: 16px;
          box-sizing: border-box;
        }
        .mathfield-container math-field {
          width: 100%;
          height: 100%;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
}
