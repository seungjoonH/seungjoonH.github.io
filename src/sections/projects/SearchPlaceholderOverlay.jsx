import React from 'react';
import config from '../../config';
import { useConfigStore } from '../../stores/configStore';
import { usePlaceholderAnimation } from './search/usePlaceholderAnimation';
import styles from '../projects.module.css';

const LANGUAGE_KEYS = ['ko', 'en'];

function getPlaceholderExamples(lang) {
  let key = LANGUAGE_KEYS.includes(lang) ? lang : null;
  if (key == null) key = (lang == null ? config.language.fallback : (String(lang).startsWith('ko') ? 'ko' : 'en'));
  return config.searchPlaceholderExamples[key] ?? config.searchPlaceholderExamples[config.language.fallback];
}

export const SearchPlaceholderOverlay = React.memo(function SearchPlaceholderOverlay({ paused = false }) {
  const language = useConfigStore((s) => s.language);
  const examples = getPlaceholderExamples(language);
  const { displayText, cursorVisible } = usePlaceholderAnimation(examples, { paused });
  return (
    <span className={styles.placeholderOverlay} aria-hidden="true">
      <span className={styles.placeholderText}>{displayText}</span>
      <span className={styles.placeholderCursor} style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
    </span>
  );
});

export default SearchPlaceholderOverlay;
