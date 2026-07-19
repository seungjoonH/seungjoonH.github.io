// 검색창 placeholder 타이핑 오버레이
import { memo } from 'react';
import config from '../../../config';
import { useConfigStore } from '@stores/configStore';
import { usePlaceholderAnimation } from './search/usePlaceholderAnimation';
import { buildCls } from '@utils/cssUtil';
import styles from '../projects.module.css';

function getPlaceholderExamples(lang: string): string[] {
  const key = lang.startsWith('ko') ? 'ko' : 'en';
  return config.searchPlaceholderExamples[key] ?? config.searchPlaceholderExamples[config.language.fallback];
}

interface SearchPlaceholderOverlayProps {
  paused?: boolean;
}

export const SearchPlaceholderOverlay = memo(function SearchPlaceholderOverlay({
  paused = false,
}: SearchPlaceholderOverlayProps) {
  const language = useConfigStore((s) => s.language);
  const { displayText, cursorVisible } = usePlaceholderAnimation(getPlaceholderExamples(language), {
    paused,
  });

  return (
    <span className={styles.placeholderOverlay} aria-hidden="true">
      <span className={styles.placeholderText}>{displayText}</span>
      <span className={buildCls(styles.placeholderCursor, cursorVisible && styles.placeholderCursorOn)}>
        |
      </span>
    </span>
  );
});
