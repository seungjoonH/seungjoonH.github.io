import React from 'react';

export function renderRichText(value) {
  const text = String(value ?? '');
  if (!text.includes('**')) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${idx}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`text-${idx}`}>{part}</span>;
  });
}

export function renderLinkTitle(value, linkSepClassName) {
  const text = String(value ?? '');
  const pipeIndex = text.indexOf('|');
  if (pipeIndex < 0) return renderRichText(text);
  const left = text.slice(0, pipeIndex).trim();
  const right = text.slice(pipeIndex + 1).trim();
  return (
    <>
      <span>{renderRichText(left)}</span>
      {linkSepClassName != null ? <span className={linkSepClassName}> | </span> : ' | '}
      <strong>{renderRichText(right)}</strong>
    </>
  );
}
