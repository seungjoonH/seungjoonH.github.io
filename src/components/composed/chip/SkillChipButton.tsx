// 스킬 칩 버튼. size medium 고정, secondary. hover: 음영 + 살짝 상승
import type { MouseEvent, ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { Chip } from '@components/design/chip/Chip';
import styles from './skillChipButton.module.css';

export interface SkillChipButtonProps {
  label: string;
  iconName?: string;
  ariaLabel: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export function SkillChipButton({
  label,
  iconName,
  ariaLabel,
  onClick,
  disabled,
}: SkillChipButtonProps): ReactNode {
  return (
    <button
      type="button"
      className={buildCls(styles.root, 'hoverable')}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <span aria-hidden="true">
        <Chip.Secondary label={label} iconName={iconName} size="medium" />
      </span>
    </button>
  );
}
