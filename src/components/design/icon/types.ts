// Icon / IconButton 타입
import type { DesignOpacity, DesignShape, DesignSize, DesignVariant } from '../designTokens';

export const ICON_SIZES = ['small', 'medium', 'large'] as const;
export type IconSize = DesignSize;

/** SVG 획 스타일 — assets/icons/ui/{outline|fill} */
export const ICON_KINDS = ['outline', 'fill'] as const;
export type IconKind = (typeof ICON_KINDS)[number];

export interface IconProps {
  name: string;
  /** outline | fill. Brand는 무시. 기본 outline */
  kind?: IconKind;
  /** 셸 표면 (primary / secondary / outlined). embedded 시 무시 */
  variant?: DesignVariant;
  size?: IconSize;
  opacity?: DesignOpacity;
  shape?: DesignShape;
  embedded?: boolean;
  alt?: string;
}
