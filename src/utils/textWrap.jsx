import React from 'react';

export function renderTextWithBreakAtSpaces(text, wordClassName, renderSegment) {
  if (text == null || text === '') return null;
  const str = String(text);
  const segments = str.split(/(\s+)/);
  return segments.map((seg, i) => {
    if (/^\s+$/.test(seg)) return seg;
    const content = typeof renderSegment === 'function' ? renderSegment(seg) : seg;
    return (
      <span key={i} className={wordClassName}>
        {content}
      </span>
    );
  });
}

export default { renderTextWithBreakAtSpaces };
