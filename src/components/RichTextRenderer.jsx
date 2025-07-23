import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function RichTextRenderer({ html }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (!ref.current) return;

    // ✅ Duyệt tất cả các node có data-math-inline (span & div)
    const mathNodes = ref.current.querySelectorAll('[data-math-inline]');
    mathNodes.forEach(node => {
      const latex = node.getAttribute('value') || '';
      try {
        const rendered = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: node.tagName === 'DIV', // block mode nếu là div
        });
        node.innerHTML = rendered;

        // ✅ Styling
        node.style.background = '#f0f0f0';
        node.style.padding = '4px 6px';
        node.style.borderRadius = '4px';
        node.style.margin = '8px 0';
        node.style.overflowX = 'auto';

        // Đảm bảo layout đúng cho block
        if (node.tagName === 'DIV') {
          node.style.display = 'block';
        } else {
          node.style.display = 'inline-block';
        }
      } catch (err) {
        node.innerText = latex;
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose max-w-full break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
