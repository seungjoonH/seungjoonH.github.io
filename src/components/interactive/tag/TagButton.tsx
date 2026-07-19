// Tag에 aria/onClick만 얹는 버튼. underline=false 고정, hover 시 true.
import type { MouseEvent, ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { pressFeedbackClass } from '../pressFeedback';
import { Tag } from '@components/design/tag/Tag';
import styles from './tagButton.module.css';

export interface TagButtonProps {
  name: string;
  ariaLabel: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export function TagButton({ name, ariaLabel, onClick, disabled }: TagButtonProps): ReactNode {
  return (
    <button
      type="button"
      className={buildCls(styles.tagButton, pressFeedbackClass('press-shade'))}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <span aria-hidden="true">
        <Tag name={name} underline={false} />
      </span>
    </button>
  );
}
