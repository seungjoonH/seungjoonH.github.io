// pressed 상태에 따라 Icon variant를 바꾸는 Interactive 토글
import { forwardRef, type MouseEvent } from 'react';
import { IconButton } from './IconButton';
import type { IconProps } from '@components/design/icon/types';
import type { DesignVariant } from '@components/design/designTokens';

export type ToggleIconButtonProps = Omit<IconProps, 'variant' | 'surface' | 'embedded' | 'alt'> & {
  pressed: boolean;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** pressed=false 일 때 surface (기본 outlined) */
  offVariant?: DesignVariant;
  /** pressed=true 일 때 surface (기본 secondary) */
  onVariant?: DesignVariant;
};

export const ToggleIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ToggleIconButtonProps>(
  function ToggleIconButton(
    {
      pressed,
      offVariant = 'outlined',
      onVariant = 'secondary',
      name,
      size = 'large',
      shape,
      opacity,
      ariaLabel,
      title,
      disabled,
      onClick,
    },
    ref
  ) {
    const variant = pressed ? onVariant : offVariant;
    const IconButtonVariant = {
      primary: IconButton.Primary,
      secondary: IconButton.Secondary,
      outlined: IconButton.Outlined,
    }[variant];
    return (
      <IconButtonVariant
        ref={ref}
        name={name}
        size={size}
        shape={shape}
        opacity={opacity}
        pressed={pressed}
        ariaLabel={ariaLabel}
        title={title}
        disabled={disabled}
        onClick={onClick}
      />
    );
  }
);
