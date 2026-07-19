// projectSearchStore 바인딩 검색 필드 + 결과 수·단축 힌트
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { Icon } from '@components/design/icon/Icon';
import { SearchField } from '@components/interactive/field/SearchField';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { SearchPlaceholderOverlay } from '@sections/projects/SearchPlaceholderOverlay';
import { useAnalytics } from '@hooks/useAnalytics';
import styles from '@sections/projects.module.css';
import type { DesignSize, LayoutWidth } from '@components/design/designTokens';

export interface ProjectSearchFieldProps {
  matchedCount?: number;
  totalCount?: number;
  showResultCount?: boolean;
  size?: DesignSize;
  width?: LayoutWidth;
}

export function ProjectSearchField({
  matchedCount = 0,
  totalCount = 0,
  showResultCount = false,
  size = 'medium',
  width = 'stretch',
}: ProjectSearchFieldProps): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const { trackSearchSubmit } = useAnalytics();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const queryAppliedByShortcut = useProjectSearchStore((s) => s.queryAppliedByShortcut);
  const shortcutHintDismissed = useProjectSearchStore((s) => s.shortcutHintDismissed);
  const setQuery = useProjectSearchStore((s) => s.setQuery);
  const dismissShortcutHint = useProjectSearchStore((s) => s.dismissShortcutHint);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    trackSearchSubmit(rawQuery);
  };

  const showTooltip = rawQuery && queryAppliedByShortcut && !shortcutHintDismissed;

  return (
    <div className={styles.searchBarBlock}>
      <SearchField
        value={rawQuery}
        onChange={setQuery}
        size={size}
        width={width}
        ariaLabel={a11y('project.searchInput')}
        clearAriaLabel={a11y('project.searchClear')}
        onKeyDown={handleSearchKeyDown}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        overlay={!rawQuery ? <SearchPlaceholderOverlay paused={isSearchFocused} /> : null}
      />
      {showResultCount && (
        <p className={styles.searchResultCount} role="status" aria-live="polite">
          {t('project.searchResultCount', { count: matchedCount, total: totalCount })}
        </p>
      )}
      {showTooltip && (
        <div className={styles.searchAppliedTooltip} role="status" aria-live="polite">
          <span className={styles.searchAppliedTooltipArrow} aria-hidden="true" />
          <span className={styles.searchAppliedTooltipText}>{t('project.searchAppliedHint')}</span>
          <button
            type="button"
            className={styles.searchAppliedTooltipClose}
            onClick={dismissShortcutHint}
            aria-label={a11y('project.searchTooltipClose')}
          >
            <Icon.Primary name="close" embedded />
          </button>
        </div>
      )}
    </div>
  );
}
