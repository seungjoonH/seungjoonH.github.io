// Icon을 감싼 버튼. glyph=레이아웃은 부모 슬롯 크기, ::before로 터치만 44px.
import { forwardRef } from 'react';
import { buildCls } from '@utils/cssUtil';
import { resolveActionable, type ClickAction, type DistributiveOmit } from '../actionable';
import { pressFeedbackClass, type PressFeedback } from '../pressFeedback';
import { Icon } from '@components/design/icon/Icon';
import styles from './iconButton.module.css';
import type { IconProps, IconKind } from '@components/design/icon/types';
import type { DesignVariant } from '@components/design/designTokens';

export type IconButtonProps = Omit<IconProps, 'variant' | 'kind' | 'embedded' | 'alt'> &
  ClickAction & {
    /** 버튼·아이콘 셸 표면 */
    variant?: DesignVariant;
    /** SVG outline | fill. 기본 outline */
    iconKind?: IconKind;
    /** 기본 press-shade */
    feedback?: PressFeedback;
    ariaLabel: string;
    title?: string;
    disabled?: boolean;
    pressed?: boolean;
    tabIndex?: number;
    /**
     * 보이는 크기는 부모 슬롯(글림프), 터치만 ::before 44×44.
     * SearchField clear 등 행 높이를 셸(28/36/44)로 키우면 안 될 때.
     */
    glyph?: boolean;
  };

const IconButtonRoot = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  function IconButtonRoot(
    {
      name,
      size = 'medium',
      variant = 'primary',
      iconKind = 'outline',
      feedback = 'press-shade',
      shape = 'rounded',
      onClick,
      href,
      ariaLabel,
      title,
      disabled,
      pressed,
      tabIndex,
      glyph = false,
    },
    ref
  ) {
    const action: ClickAction = href ? { href } : { onClick };
    const { Tag, actionProps, isButton } = resolveActionable(action);
    const IconVariant = { primary: Icon.Primary, secondary: Icon.Secondary, outlined: Icon.Outlined }[variant];
    return (
      <Tag
        ref={ref}
        {...actionProps}
        className={buildCls(
          styles.iconButton,
          glyph && styles.glyph,
          shape === 'square' && styles.square,
          shape === 'full' && styles.full,
          pressFeedbackClass(feedback)
        )}
        aria-label={ariaLabel}
        title={title}
        disabled={isButton ? disabled : undefined}
        aria-pressed={isButton ? pressed : undefined}
        tabIndex={tabIndex}
      >
        <span className={styles.face} aria-hidden="true">
          {glyph ? (
            <Icon.Primary name={name} kind={iconKind} embedded />
          ) : (
            <IconVariant name={name} kind={iconKind} size={size} shape={shape} />
          )}
        </span>
      </Tag>
    );
  }
);

function withVariant(variant: DesignVariant) {
  return forwardRef<HTMLButtonElement | HTMLAnchorElement, DistributiveOmit<IconButtonProps, 'variant'>>(
    function IconButtonVariant(props, ref) {
      return <IconButtonRoot {...props} variant={variant} ref={ref} />;
    }
  );
}

/** Root는 export하지 않는다 — <IconButton variant="x">가 아니라 <IconButton.Primary>만 쓰도록 타입으로 막는다 */
export const IconButton = {
  Primary: withVariant('primary'),
  Secondary: withVariant('secondary'),
  Outlined: withVariant('outlined'),
};
