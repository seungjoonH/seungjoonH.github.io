import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/shared/icon/Icon';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { SearchPlaceholderOverlay } from './SearchPlaceholderOverlay';
import styles from '../projects.module.css';

export function ProjectSearchBar() {
  const { t } = useTranslation();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const queryAppliedByShortcut = useProjectSearchStore((s) => s.queryAppliedByShortcut);
  const shortcutHintDismissed = useProjectSearchStore((s) => s.shortcutHintDismissed);
  const setQuery = useProjectSearchStore((s) => s.setQuery);
  const dismissShortcutHint = useProjectSearchStore((s) => s.dismissShortcutHint);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const showTooltip = rawQuery && queryAppliedByShortcut && !shortcutHintDismissed;

  return (
    <div className={styles.searchBarBlock}>
      <div className={styles.searchWrap} role="search">
        <span className={styles.searchIcon} aria-hidden="true">
          <Icon name="search" />
        </span>
        <div className={styles.searchInputWrap}>
          <input
            type="search"
            value={rawQuery}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder=""
            aria-label="프로젝트 검색"
            autoComplete="off"
          />
          {!rawQuery ? <SearchPlaceholderOverlay paused={isSearchFocused} /> : null}
        </div>
        {rawQuery ? (
          <button
            type="button"
            className={styles.searchClear}
            onClick={() => setQuery('')}
            aria-label="검색어 지우기"
          >
            <Icon name="close" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {showTooltip ? (
        <div
          className={styles.searchAppliedTooltip}
          role="status"
          aria-live="polite"
        >
          <span className={styles.searchAppliedTooltipArrow} aria-hidden="true" />
          <span className={styles.searchAppliedTooltipText}>
            {t('project.searchAppliedHint', '검색어가 적용된 상태예요!')}
          </span>
          <button
            type="button"
            className={styles.searchAppliedTooltipClose}
            onClick={dismissShortcutHint}
            aria-label={t('project.searchAppliedTooltipClose', '툴팁 닫기')}
          >
            <Icon name="close" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
