// Text를 감싼 버튼
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { resolveActionable, type ClickAction, type DistributiveOmit } from '../actionable';
import { pressFeedbackClass } from '../pressFeedback';
import { Text } from '@components/design/button/Text';
import styles from './button.module.css';
import type { TextButtonProps } from './type';
import type { DesignVariant } from '@components/design/designTokens';

function TextButtonRoot({
  iconName,
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  feedback = 'press-shade',
  width = 'hug',
  onClick,
  href,
  ariaLabel,
  title,
  disabled,
  pressed,
}: TextButtonProps): ReactNode {
  const action: ClickAction = href ? { href } : { onClick };
  const { Tag, actionProps, isButton } = resolveActionable(action);
  const TextVariant = { primary: Text.Primary, secondary: Text.Secondary, outlined: Text.Outlined }[variant];
  return (
    <Tag
      {...actionProps}
      className={buildCls(
        styles.textButton,
        shape === 'square' && styles.square,
        shape === 'full' && styles.full,
        pressFeedbackClass(feedback)
      )}
      data-width={width}
      aria-label={ariaLabel}
      title={title}
      disabled={isButton ? disabled : undefined}
      aria-pressed={isButton ? pressed : undefined}
    >
      <span aria-hidden="true">
        <TextVariant iconName={iconName} size={size} shape={shape}>
          {children}
        </TextVariant>
      </span>
    </Tag>
  );
}

function withVariant(variant: DesignVariant) {
  return function TextButtonVariant(props: DistributiveOmit<TextButtonProps, 'variant'>): ReactNode {
    return <TextButtonRoot {...props} variant={variant} />;
  };
}

/** Root는 export하지 않는다 — <TextButton variant="x">가 아니라 <TextButton.Primary>만 쓰도록 타입으로 막는다 */
export const TextButton = {
  Primary: withVariant('primary'),
  Secondary: withVariant('secondary'),
  Outlined: withVariant('outlined'),
};
