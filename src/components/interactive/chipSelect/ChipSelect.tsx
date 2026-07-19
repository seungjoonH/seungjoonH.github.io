// ChipButton으로 밀도 높은 단일 선택 그룹 (Segmented 대안)
import type { ReactNode } from 'react';
import { ChipButton } from '@components/interactive/chip/ChipButton';
import styles from './chipSelect.module.css';
import type { ChipSelectProps } from './type';

export function ChipSelect({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'small',
}: ChipSelectProps): ReactNode {
  return (
    <div className={styles.root}>
      <span className={styles.label} aria-hidden="true">
        {ariaLabel}
      </span>
      <div className={styles.chips} role="radiogroup" aria-label={ariaLabel}>
        {options.map((opt) => {
          const selected = value === opt.value;
          const ChipVariant = selected ? ChipButton.Secondary : ChipButton.Outlined;
          return (
            <ChipVariant
              key={opt.value}
              label={opt.label}
              size={size}
              ariaLabel={opt.ariaLabel ?? `${opt.label}${selected ? ', selected' : ''}`}
              onClick={() => {
                if (!selected) onChange(opt.value);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export type { ChipSelectProps, ChipSelectOption } from './type';
