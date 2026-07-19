// 밑줄 검색 입력 — size(스케일)와 width(hug|stretch)를 분리
import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  useId,
} from 'react';
import { buildCls } from '@utils/cssUtil';
import { Icon } from '@components/design/icon/Icon';
import { IconButton } from '@components/interactive/icon/IconButton';
import type { DesignSize, LayoutWidth } from '@components/design/designTokens';
import styles from './searchField.module.css';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  clearAriaLabel?: string;
  size?: DesignSize;
  width?: LayoutWidth;
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  /** 입력 위 오버레이(플레이스홀더 애니메이션 등) */
  overlay?: ReactNode;
}

const LEADING_SIZE: Record<DesignSize, string> = {
  small: styles.leadingSmall,
  medium: styles.leadingMedium,
  large: styles.leadingLarge,
};

export function SearchField({
  value,
  onChange,
  ariaLabel,
  clearAriaLabel = 'Clear search',
  size = 'medium',
  width = 'stretch',
  disabled,
  onKeyDown,
  onFocus,
  onBlur,
  overlay,
}: SearchFieldProps): ReactNode {
  const inputId = useId();
  const hasValue = Boolean(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <search
      className={buildCls(
        styles.root,
        width === 'stretch' ? styles.stretch : styles.hug,
        styles[size]
      )}
      aria-label={ariaLabel}
    >
      <span className={buildCls(styles.leading, LEADING_SIZE[size])} aria-hidden="true">
        <Icon.Primary name="search" embedded />
      </span>
      <div className={styles.inputWrap}>
        <input
          id={inputId}
          type="search"
          className={styles.input}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder=""
          aria-label={ariaLabel}
          autoComplete="off"
          disabled={disabled}
        />
        {overlay}
      </div>
      <span className={buildCls(styles.clear, LEADING_SIZE[size], hasValue && styles.clearVisible)}>
        <IconButton.Primary
          name="close"
          glyph
          ariaLabel={clearAriaLabel}
          onClick={() => onChange('')}
          disabled={disabled || !hasValue}
          tabIndex={hasValue ? 0 : -1}
        />
      </span>
    </search>
  );
}
