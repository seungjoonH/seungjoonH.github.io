// ChipSelect 옵션·props 타입
import type { DesignSize } from '@components/design/designTokens';

export interface ChipSelectOption {
  value: string;
  label: string;
  ariaLabel?: string;
}

export interface ChipSelectProps {
  options: ChipSelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Chip size. 기본 small */
  size?: Extract<DesignSize, 'small' | 'medium'>;
}
