// 스택 칩 버튼. size small 고정. outlined → hover secondary. translate 없음
import type { MouseEvent, ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { Chip } from '@components/design/chip/Chip';
import styles from './stackChipButton.module.css';

export interface StackChipButtonProps {
  label: string;
  iconName?: string;
  ariaLabel: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** 검색 매칭 시 항상 secondary */
  matched?: boolean;
  disabled?: boolean;
}

export function StackChipButton({
  label,
  iconName,
  ariaLabel,
  onClick,
  matched = false,
  disabled,
}: StackChipButtonProps): ReactNode {
  const ChipVariant = matched ? Chip.Secondary : Chip.Outlined;
  return (
    <button
      type="button"
      className={buildCls(styles.root, matched && styles.matched)}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.chip} aria-hidden="true">
        <ChipVariant label={label} iconName={iconName} size="small" />
      </span>
    </button>
  );
}
