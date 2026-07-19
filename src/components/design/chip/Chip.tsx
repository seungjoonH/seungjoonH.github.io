// 아이콘+라벨 칩
import type { ReactNode } from 'react';
import { Icon } from '@components/design/icon/Icon';
import { buildCls } from '@utils/cssUtil';
import surface from '../surface.module.css';
import opacityStyles from '../opacity.module.css';
import styles from './chip.module.css';
import { DESIGN_OPACITIES, DESIGN_SHAPES, DESIGN_SIZES, DESIGN_VARIANTS, type DesignVariant } from '../designTokens';
import type { ChipProps } from './type';

function ChipRoot({
  label,
  iconName,
  size = 'medium',
  variant = 'primary',
  opacity = 'full',
  shape = 'rounded',
}: ChipProps): ReactNode {
  const sizeKey = DESIGN_SIZES.includes(size) ? size : 'medium';
  const variantKey = DESIGN_VARIANTS.includes(variant) ? variant : 'primary';
  const opacityKey = DESIGN_OPACITIES.includes(opacity) ? opacity : 'full';
  const shapeKey = DESIGN_SHAPES.includes(shape) ? shape : 'rounded';
  const chipCls = buildCls(
    styles.chip,
    styles[sizeKey],
    surface[variantKey],
    opacityStyles[opacityKey],
    shapeKey === 'square' && styles.square,
    shapeKey === 'full' && styles.full
  );

  return (
    <span className={chipCls}>
      {iconName && (
        <span className={styles.icon} aria-hidden="true">
          <Icon.Primary name={iconName} embedded />
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </span>
  );
}

function withVariant(variant: DesignVariant) {
  return function ChipVariant(props: Omit<ChipProps, 'variant'>): ReactNode {
    return <ChipRoot {...props} variant={variant} />;
  };
}

/** Root는 export하지 않는다 — <Chip variant="x">가 아니라 <Chip.Primary>만 쓰도록 타입으로 막는다 */
export const Chip = {
  Primary: withVariant('primary'),
  Secondary: withVariant('secondary'),
  Outlined: withVariant('outlined'),
};
