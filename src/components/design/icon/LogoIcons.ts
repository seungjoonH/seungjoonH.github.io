// 사이트·제품 로고 마크 이름 상수 (assets/icons/logo)
export const LogoIcons = {
  pano: 'pano',
} as const;

export type LogoIconName = (typeof LogoIcons)[keyof typeof LogoIcons];

export const LOGO_ICON_NAMES = Object.values(LogoIcons);
