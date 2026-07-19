// 아이콘(선택)+라벨 텍스트
import type { ReactNode } from 'react';
import { Icon } from '@components/design/icon/Icon';
import { buildCls } from '@utils/cssUtil';
import surface from '../surface.module.css';
import opacityStyles from '../opacity.module.css';
import styles from './text.module.css';
import {
  DESIGN_OPACITIES,
  DESIGN_SIZES,
  DESIGN_SHAPES,
  DESIGN_VARIANTS,
  type DesignOpacity,
  type DesignShape,
  type DesignSize,
  type DesignVariant,
} from '../designTokens';

export type TextTone = 'surface' | 'plain';

export interface TextProps {
  iconName?: string;
  children?: ReactNode;
  size?: DesignSize;
  variant?: DesignVariant;
  opacity?: DesignOpacity;
  shape?: DesignShape;
  /** surface(기본)=버튼 라벨 / plain=패딩·surface 없이 inherit (링크 톤) */
  tone?: TextTone;
  underline?: boolean;
}

function TextRoot({
  iconName,
  children,
  size = 'medium',
  variant = 'primary',
  opacity = 'full',
  shape = 'rounded',
  tone = 'surface',
  underline = false,
}: TextProps): ReactNode {
  const sizeKey = DESIGN_SIZES.includes(size) ? size : 'medium';
  const variantKey = DESIGN_VARIANTS.includes(variant) ? variant : 'primary';
  const opacityKey = DESIGN_OPACITIES.includes(opacity) ? opacity : 'full';
  const shapeKey = DESIGN_SHAPES.includes(shape) ? shape : 'rounded';
  const isPlain = tone === 'plain';
  const textCls = buildCls(
    styles.text,
    isPlain ? styles.plain : styles[sizeKey],
    !isPlain && surface[variantKey],
    opacityStyles[opacityKey],
    !isPlain && shapeKey === 'square' && styles.square,
    !isPlain && shapeKey === 'full' && styles.full,
    underline && styles.underline
  );

  return (
    <span className={textCls}>
      {iconName && (
        <span className={styles.icon} aria-hidden="true">
          <Icon.Primary name={iconName} embedded />
        </span>
      )}
      {children != null && children !== false && <span className={styles.label}>{children}</span>}
    </span>
  );
}

function withVariant(variant: DesignVariant) {
  return function TextVariant(props: Omit<TextProps, 'variant'>): ReactNode {
    return <TextRoot {...props} variant={variant} />;
  };
}

/** Root는 export하지 않는다 — <Text variant="x">가 아니라 <Text.Primary>만 쓰도록 타입으로 막는다 */
export const Text = {
  Primary: withVariant('primary'),
  Secondary: withVariant('secondary'),
  Outlined: withVariant('outlined'),
};
