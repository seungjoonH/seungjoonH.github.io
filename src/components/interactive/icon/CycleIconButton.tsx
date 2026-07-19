// N개 상태를 클릭으로 순환하는 IconButton (Toggle의 이진과 구분)
import { forwardRef, type MouseEvent } from 'react';
import { IconButton } from './IconButton';
import { nextCycleValue } from './nextCycleValue';
import type { DesignShape, DesignSize } from '@components/design/designTokens';

export interface CycleIconOption {
  value: string;
  iconName: string;
  ariaLabel: string;
  title?: string;
}

export interface CycleIconButtonProps {
  value: string;
  options: readonly CycleIconOption[];
  onChange: (next: string) => void;
  size?: DesignSize;
  shape?: DesignShape;
  disabled?: boolean;
  /** 이 값일 때 pressed=false (기본: options[0]) */
  defaultValue?: string;
}

export const CycleIconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, CycleIconButtonProps>(
  function CycleIconButton(
    { value, options, onChange, size = 'large', shape = 'full', disabled, defaultValue },
    ref
  ) {
    const current = options.find((o) => o.value === value) ?? options[0];
    const baseline = defaultValue ?? options[0]?.value;
    const pressed = Boolean(current && baseline != null && current.value !== baseline);

    const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      e.preventDefault();
      if (!options.length) return;
      onChange(nextCycleValue(current?.value ?? options[0].value, options));
    };

    if (!current) return null;

    const IconButtonVariant = pressed ? IconButton.Secondary : IconButton.Outlined;
    return (
      <IconButtonVariant
        ref={ref}
        name={current.iconName}
        size={size}
        shape={shape}
        pressed={pressed}
        disabled={disabled}
        ariaLabel={current.ariaLabel}
        title={current.title ?? current.ariaLabel}
        onClick={handleClick}
      />
    );
  }
);
