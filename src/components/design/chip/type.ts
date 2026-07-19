// Chip 디자인 타입
import type { DesignOpacity, DesignShape, DesignSize, DesignVariant } from '../designTokens';

export type ChipSize = DesignSize;
export type ChipVariant = DesignVariant;

export const CHIP_SIZES = ['large', 'medium', 'small'] as const;
export const CHIP_VARIANTS = ['primary', 'secondary', 'outlined'] as const;

export interface ChipProps {
  label: string;
  iconName?: string;
  size?: ChipSize;
  variant?: ChipVariant;
  opacity?: DesignOpacity;
  /** square(0) | rounded(기본) | full */
  shape?: DesignShape;
}
