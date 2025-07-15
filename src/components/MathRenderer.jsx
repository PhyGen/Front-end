import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function MathRenderer({ latex, block = false }) {
  return (
    <span
      className={block ? 'katex-display' : ''}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(latex, { throwOnError: false, displayMode: block }),
      }}
    />
  );
} 