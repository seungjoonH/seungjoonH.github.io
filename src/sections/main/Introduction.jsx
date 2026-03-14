import React, { useEffect, useState } from 'react';
import styles from './introduction.module.css';
import { buildCls } from '../../utils/cssUtil';

export function Introduction({ text }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setTimeout(() => { setStage(1); }, 1500);
    setTimeout(() => { setStage(2); }, 2300);
  }, []);

  const parseText = (inputText) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /@\[(.*?)\]/g;
    let match;

    while ((match = regex.exec(inputText)) !== null) {
      const beforeText = inputText.substring(lastIndex, match.index);
      if (beforeText) parts.push(beforeText);

      parts.push(
        <span key={match.index} className={styles.highlight}>
          {match[1]}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < inputText.length) {
      parts.push(inputText.substring(lastIndex));
    }

    return parts;
  };

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
        <p key={i} className={buildCls(styles.intro, i >= 2 && styles.introSecondary)}>{parseText(paragraph)}</p>
      ))}
      {bulletItems.length > 0 ? (
        <ul className={styles.introList}>
          {bulletItems.map((item, i) => (
            <li key={i} className={styles.introListItem}>{parseText(item)}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}