// projectSearchStore에 쿼리를 넣는 검색 단축 칩
import { forwardRef, type MouseEvent, type ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { SearchChipButton } from '@components/composed/chip/SearchChipButton';
import {
  resolveSearchShortcut,
  type SearchShortcutType,
} from './searchShortcuts';
import type { DesignSize } from '@components/design/designTokens';

export interface SearchShortcutChipButtonProps {
  /** 프리셋 id. 없으면 label+query 필수 */
  type?: SearchShortcutType | (string & {});
  label?: string;
  query?: string;
  size?: DesignSize;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const SearchShortcutChipButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SearchShortcutChipButtonProps
>(function SearchShortcutChipButton(
  { type, label, query, size = 'small', disabled, onClick },
  ref
): ReactNode {
  const a11y = useA11y();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const resolved = resolveSearchShortcut({ type, label, query });
  if (!resolved) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    setQueryFromShortcut(resolved.query);
  };

  return (
    <SearchChipButton
      ref={ref}
      label={resolved.label}
      size={size}
      disabled={disabled}
      ariaLabel={a11y('project.searchShortcut', { label: resolved.label })}
      onClick={handleClick}
    />
  );
});
