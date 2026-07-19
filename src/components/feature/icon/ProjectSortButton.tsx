// projectSearchStore sort 모드 순환 Feature
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { CycleIconButton } from '@components/interactive/icon/CycleIconButton';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import {
  applySortModeToRawQuery,
  getSortModeFromRawQuery,
  nextSortModeAfterClick,
} from '@sections/projects/search/querySortMode';
import type { SortMode } from '@sections/projects/search/stripSort';

const SORT_VALUES = ['recent', 'oldest', 'status'] as const;

function asSortMode(value: string): SortMode {
  if (value === 'oldest' || value === 'status') return value;
  return null;
}

function labelForSortMode(mode: SortMode | 'recent', t: (key: string) => string): string {
  if (mode === 'oldest') return t('project.sortOrderOldest');
  if (mode === 'status') return t('project.sortOrderStatus');
  return t('project.sortOrderRecent');
}

export function ProjectSortButton(): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQuery = useProjectSearchStore((s) => s.setQuery);
  const parsed = getSortModeFromRawQuery(rawQuery);
  const value = parsed ?? 'recent';

  const options = SORT_VALUES.map((mode) => {
    const currentMode = mode === 'recent' ? null : mode;
    const nextMode = nextSortModeAfterClick(currentMode) ?? 'recent';
    const current = labelForSortMode(mode, t);
    const following = labelForSortMode(nextMode, t);
    return {
      value: mode,
      iconName: mode === 'oldest' ? 'sort-oldest' : mode === 'status' ? 'sort-status' : 'sort-recent',
      ariaLabel: a11y('project.sortCycle', { current, next: following }),
      title: t('project.sortButtonTitle', { current, next: following }),
    };
  });

  return (
    <CycleIconButton
      value={value}
      options={options}
      defaultValue="recent"
      size="large"
      shape="full"
      onChange={(nextValue) => {
        setQuery(applySortModeToRawQuery(rawQuery, asSortMode(nextValue)));
      }}
    />
  );
}
