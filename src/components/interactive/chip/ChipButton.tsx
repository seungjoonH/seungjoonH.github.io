// Chip을 감싼 버튼
import { forwardRef } from 'react';
import { buildCls } from '@utils/cssUtil';
import { resolveActionable, type ClickAction, type DistributiveOmit } from '../actionable';
import { pressFeedbackClass } from '../pressFeedback';
import { Chip } from '@components/design/chip/Chip';
import styles from './chipButton.module.css';
import type { ChipButtonProps } from './type';
import type { DesignVariant } from '@components/design/designTokens';

const ChipButtonRoot = forwardRef<HTMLButtonElement | HTMLAnchorElement, ChipButtonProps>(
  function ChipButtonRoot(
    {
      label,
      iconName,
      size = 'medium',
      variant = 'primary',
      opacity,
      shape = 'rounded',
      feedback = 'press-shade',
      onClick,
      href,
      ariaLabel,
      disabled,
      title,
    },
    ref
  ) {
    const action: ClickAction = href ? { href } : { onClick };
    const { Tag, actionProps, isButton } = resolveActionable(action);
    const ChipVariant = { primary: Chip.Primary, secondary: Chip.Secondary, outlined: Chip.Outlined }[variant];
    return (
      <Tag
        ref={ref}
        {...actionProps}
        className={buildCls(
          styles.chipButton,
          shape === 'square' && styles.square,
          shape === 'full' && styles.full,
          pressFeedbackClass(feedback)
        )}
        aria-label={ariaLabel}
        title={title}
        disabled={isButton ? disabled : undefined}
      >
        <span aria-hidden="true">
          <ChipVariant
            label={label}
            iconName={iconName}
            size={size}
            opacity={opacity}
            shape={shape}
          />
        </span>
      </Tag>
    );
  }
);

function withVariant(variant: DesignVariant) {
  return forwardRef<HTMLButtonElement | HTMLAnchorElement, DistributiveOmit<ChipButtonProps, 'variant'>>(
    function ChipButtonVariant(props, ref) {
      return <ChipButtonRoot {...props} variant={variant} ref={ref} />;
    }
  );
}

/** Root는 export하지 않는다 — <ChipButton variant="x">가 아니라 <ChipButton.Primary>만 쓰도록 타입으로 막는다 */
export const ChipButton = {
  Primary: withVariant('primary'),
  Secondary: withVariant('secondary'),
  Outlined: withVariant('outlined'),
};

export type { ChipButtonProps };
