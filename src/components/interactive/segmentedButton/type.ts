import type { LayoutWidthProps } from '@components/design/designTokens';

export interface SegmentedButtonOption {
  value: string;
  label: string;
  ariaLabel?: string;
}

export interface SegmentedButtonProps extends LayoutWidthProps {
  options: SegmentedButtonOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}
