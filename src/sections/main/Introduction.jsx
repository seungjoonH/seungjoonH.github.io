import React, { Fragment, useEffect, useState } from 'react';
import styles from './introduction.module.css';
import { buildCls } from '../../utils/cssUtil';
import { renderRichText } from '../projects/utils/richText.jsx';
import { IntroLinkTrigger } from './IntroLinkTrigger.jsx';

const pushRichChunk = (parts, chunk, key) => {
  if (!chunk) return;
  const rendered = renderRichText(chunk);
  if (typeof rendered === 'string') return parts.push(rendered);
  parts.push(<Fragment key={key}>{rendered}</Fragment>);
};

function parseInlineMarkers(inputText, keyBase) {
  const parts = [];
  let lastIndex = 0;
  let match;
  const regex = /@\((\w+)\)\[([^\]]*)\]|@\[(.*?)\]/g;

  while ((match = regex.exec(inputText)) !== null) {
    const beforeText = inputText.substring(lastIndex, match.index);
    pushRichChunk(parts, beforeText, `${keyBase}-rich-${lastIndex}`);

    if (match[1]) {
      parts.push(
        <IntroLinkTrigger key={`${keyBase}-link-${match.index}`} linkId={match[1]} label={match[2]} />
      );
    }
    else {
      parts.push(
        <span key={`${keyBase}-hi-${match.index}`} className={styles.highlight}>
          {match[3]}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < inputText.length)
    pushRichChunk(parts, inputText.substring(lastIndex), `${keyBase}-rich-tail`);

  return parts;
}

export function Introduction({ text }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setTimeout(() => { setStage(1); }, 1500);
    setTimeout(() => { setStage(2); }, 2300);
  }, []);

  const lines = Array.isArray(text) ? text : text.split('\n').filter(Boolean);
  const introLines = [];
  const bulletItems = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) bulletItems.push(trimmed.slice(2));
    else introLines.push(line);
  });

  return (
    <div className={buildCls(styles.introContainer, ['', styles.fadeIn, styles.noTransition][stage])}>
      {introLines.map((paragraph, i) => (
        <p key={i} className={buildCls(styles.intro, i >= 2 && styles.introSecondary)}>
          {parseInlineMarkers(paragraph, `intro-p-${i}`)}
        </p>
      ))}
      {bulletItems.length > 0 && (
        <ul className={styles.introList}>
          {bulletItems.map((item, i) => (
            <li key={i} className={styles.introListItem}>
              {parseInlineMarkers(item, `intro-li-${i}`)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
