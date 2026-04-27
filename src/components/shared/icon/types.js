export const ICON_SIZES = Object.freeze(['sm', 'md', 'lg']);

/** 버튼용 size·variant 키와 CSS 모듈 키를 한 객체로 둔다. */
export const ICON_BUTTON = Object.freeze({
  sizes: Object.freeze({
    sm: 'iconButtonSm',
    md: 'iconButtonMd',
    lg: 'iconButtonLg',
  }),
  variants: Object.freeze({
    default: 'iconButtonDefault',
    ghost: 'iconButtonGhost',
  }),
});

export const ICON_BUTTON_SIZES = Object.freeze(Object.keys(ICON_BUTTON.sizes));
export const ICON_BUTTON_VARIANTS = Object.freeze(Object.keys(ICON_BUTTON.variants));
