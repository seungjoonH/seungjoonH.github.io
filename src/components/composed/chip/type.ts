// StatusChip / RelationChipButton 타입
import type { ChipSize } from '@components/design/chip/type';

export interface StatusChipProps {
  type: string | null;
}

export const RELATION_CHIP_BUTTON_TYPES = ['inner', 'outer'] as const;
export type RelationChipButtonType = (typeof RELATION_CHIP_BUTTON_TYPES)[number];

export interface RelationChipButtonProps {
  type: RelationChipButtonType;
  label: string;
  href: string;
  size?: ChipSize;
}
