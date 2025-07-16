import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function RichTextRenderer({ html }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (!ref.current) return;
    // Parse all mathInline nodes and render KaTeX
    const mathNodes = ref.current.querySelectorAll('span[data-math-inline]');
    mathNodes.forEach(node => {
      const latex = node.getAttribute('value') || '';
      node.innerHTML = katex.renderToString(latex, { throwOnError: false });
      node.style.background = '#f0f0f0';
      node.style.padding = '2px 4px';
      node.style.borderRadius = '3px';
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
} 