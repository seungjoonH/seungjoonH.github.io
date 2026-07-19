// 이름 기반 아이콘 — kind로 outline/fill SVG 선택
import type { FunctionComponent, ReactNode, SVGProps } from 'react';
import { buildCls } from '@utils/cssUtil';
import { fetchSvgContent, injectSvgSize } from '@utils/inlineSvg';
import { useState, useEffect } from 'react';
import surfaceStyles from '../surface.module.css';
import opacityStyles from '../opacity.module.css';
import styles from './icon.module.css';
import { DESIGN_OPACITIES, DESIGN_SHAPES, DESIGN_SIZES, DESIGN_VARIANTS, type DesignVariant } from '../designTokens';
import type { IconProps, IconKind } from './types';

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>;

const UI_OUTLINE_ICONS = import.meta.glob<SvgComponent>('/src/assets/icons/ui/outline/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
});

const UI_FILL_ICONS = import.meta.glob<SvgComponent>('/src/assets/icons/ui/fill/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
});

const BRAND_ICONS = import.meta.glob<SvgComponent>('/src/assets/icons/brand/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
});

const LOGO_ICONS = import.meta.glob<SvgComponent>('/src/assets/icons/logo/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
});

function uiIcon(kind: IconKind, name: string): SvgComponent | undefined {
  const map = kind === 'fill' ? UI_FILL_ICONS : UI_OUTLINE_ICONS;
  return map[`/src/assets/icons/ui/${kind}/${name}.svg`];
}

function iconComponentFor(name: string, kind: IconKind): SvgComponent | undefined {
  return (
    uiIcon(kind, name) ??
    LOGO_ICONS[`/src/assets/icons/logo/${name}.svg`] ??
    BRAND_ICONS[`/src/assets/icons/brand/${name}.svg`]
  );
}

function IconRoot({
  name,
  kind = 'outline',
  variant = 'primary',
  size = 'medium',
  opacity = 'full',
  shape = 'rounded',
  embedded = false,
  alt = '',
}: IconProps): ReactNode {
  if (!name) return null;
  const SvgComponent = iconComponentFor(name, kind);
  if (!SvgComponent) return null;

  const ariaHidden = !alt.trim();
  const opacityKey = DESIGN_OPACITIES.includes(opacity) ? opacity : 'full';
  const svg = (
    <SvgComponent
      className={styles.svgFill}
      focusable="false"
      role="img"
      aria-hidden={ariaHidden}
      title={ariaHidden ? undefined : alt}
    />
  );

  if (embedded) {
    return <span className={buildCls(styles.embedded, opacityStyles[opacityKey])}>{svg}</span>;
  }

  const sizeKey = DESIGN_SIZES.includes(size) ? size : 'medium';
  const variantKey = DESIGN_VARIANTS.includes(variant) ? variant : 'primary';
  const shapeKey = DESIGN_SHAPES.includes(shape) ? shape : 'rounded';
  const shellCls = buildCls(
    styles.shell,
    styles[sizeKey],
    surfaceStyles[variantKey],
    variantKey === 'primary' && styles.primary,
    opacityStyles[opacityKey],
    shapeKey === 'square' && styles.square,
    shapeKey === 'full' && styles.full
  );

  return (
    <span className={shellCls}>
      <span className={styles.glyph}>{svg}</span>
    </span>
  );
}

function withVariant(variant: DesignVariant) {
  return function IconVariant(props: Omit<IconProps, 'variant'>): ReactNode {
    return <IconRoot {...props} variant={variant} />;
  };
}

/** Root는 export하지 않는다 — <Icon variant="x">가 아니라 <Icon.Primary>만 쓰도록 타입으로 막는다 */
export const Icon = {
  Primary: withVariant('primary'),
  Secondary: withVariant('secondary'),
  Outlined: withVariant('outlined'),
};

export type { IconProps, IconKind };
export { Icons, type IconName, ICON_NAMES } from './Icons';
export { ICON_KINDS } from './types';
export { BrandIcons, type BrandIconName, BRAND_ICON_NAMES } from './BrandIcons';
export { LogoIcons, type LogoIconName, LOGO_ICON_NAMES } from './LogoIcons';

export interface SvgIconProps {
  src: string;
  alt?: string;
  onError?: () => void;
  onLoad?: () => void;
}

/** URL 기반 SVG. name 기반 Icon과 동시에 쓰지 않는다. */
export function SvgIcon({ src, alt = '', onError, onLoad }: SvgIconProps): ReactNode {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src.toLowerCase().endsWith('.svg')) {
      setSvgContent(null);
      setFailed(true);
      onError?.();
      return;
    }
    setFailed(false);
    setSvgContent(null);

    fetchSvgContent(src)
      .then((text) => {
        setSvgContent(text);
        onLoad?.();
      })
      .catch(() => {
        setFailed(true);
        onError?.();
      });
  }, [src, onError, onLoad]);

  if (!src || failed || !svgContent) return null;

  const ariaHidden = !alt.trim();
  return (
    <span
      role="img"
      aria-label={ariaHidden ? undefined : alt}
      aria-hidden={ariaHidden}
      className={styles.iconRootBlock}
      dangerouslySetInnerHTML={{ __html: injectSvgSize(svgContent) }}
    />
  );
}
