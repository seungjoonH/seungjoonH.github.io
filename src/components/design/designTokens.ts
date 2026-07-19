// Icon / Text / Chip 공통 variant·size·opacity·radius
export const DESIGN_VARIANTS = ['primary', 'secondary', 'outlined'] as const;
export type DesignVariant = (typeof DESIGN_VARIANTS)[number];

export const DESIGN_SIZES = ['large', 'medium', 'small'] as const;
export type DesignSize = (typeof DESIGN_SIZES)[number];

/** 0 / 25 / 50 / 75 / 100 — 임의 % 금지 */
export const DESIGN_OPACITIES = ['hidden', 'faint', 'muted', 'soft', 'full'] as const;
export type DesignOpacity = (typeof DESIGN_OPACITIES)[number];

/** square(0) | rounded(기본) | full(박스 비율에 따른 완전한 곡률) */
export const DESIGN_SHAPES = ['square', 'rounded', 'full'] as const;
export type DesignShape = (typeof DESIGN_SHAPES)[number];

/** hug(콘텐츠) | stretch(부모 폭 채움) — size와 직교하는 레이아웃 축 */
export const LAYOUT_WIDTHS = ['hug', 'stretch'] as const;
export type LayoutWidth = (typeof LAYOUT_WIDTHS)[number];

export interface LayoutWidthProps {
  width?: LayoutWidth;
}
