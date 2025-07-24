import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function RichTextRenderer({ html }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (!ref.current) return;

    const mathNodes = ref.current.querySelectorAll('[data-math-inline]');
    mathNodes.forEach(node => {
      const latex = node.getAttribute('value') || '';
      try {
        const rendered = katex.renderToString(latex, {
          throwOnError: false,
          strict: false,
          displayMode: node.tagName === 'DIV',
        });
        node.innerHTML = rendered;

        // ✅ Styling chống tràn
        node.style.background = '#f0f0f0';
        node.style.padding = '4px 6px';
        node.style.borderRadius = '4px';
        node.style.margin = '8px 0';
        node.style.overflowX = 'auto';
        node.style.maxWidth = '100%';
        node.style.wordBreak = 'break-word';

        node.style.display = node.tagName === 'DIV' ? 'block' : 'inline-block';
      } catch (err) {
        node.innerText = latex;
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose max-w-full break-words"
      style={{
        maxHeight: 280,             
        overflowY: 'auto',          
        overflowX: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
