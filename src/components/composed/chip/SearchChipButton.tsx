// ChipButton full shape + search 아이콘 — 검색 단축 칩 표면
import { forwardRef, type MouseEvent, type ReactNode } from 'react';
import { ChipButton } from '@components/interactive/chip/ChipButton';
import type { DesignSize } from '@components/design/designTokens';

export interface SearchChipButtonProps {
  label: string;
  ariaLabel: string;
  size?: DesignSize;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const SearchChipButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, SearchChipButtonProps>(
  function SearchChipButton({ label, ariaLabel, size = 'small', disabled, onClick }, ref): ReactNode {
    return (
      <ChipButton.Outlined
        ref={ref}
        label={label}
        iconName="search"
        size={size}
        shape="full"
        ariaLabel={ariaLabel}
        disabled={disabled}
        onClick={onClick}
      />
    );
  }
);
