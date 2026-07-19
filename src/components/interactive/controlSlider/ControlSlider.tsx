// +/- IconButton + range. size로 버튼·트랙 스케일
import type { ReactNode } from 'react';
import { Box } from '@components/layout/box/Box';
import { IconButton } from '@components/interactive/icon/IconButton';
import { buildCls } from '@utils/cssUtil';
import {
  DESIGN_SIZES,
  type DesignSize,
  type LayoutWidthProps,
} from '@components/design/designTokens';
import styles from './controlSlider.module.css';

export interface ControlSliderProps extends LayoutWidthProps {
  legend?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  displayValue?: string;
  ariaLabel: string;
  ariaValueText: string;
  decreaseLabel: string;
  increaseLabel: string;
  size?: DesignSize;
}

export function ControlSlider({
  legend,
  value,
  min,
  max,
  step = 1,
  onChange,
  displayValue,
  ariaLabel,
  ariaValueText,
  decreaseLabel,
  increaseLabel,
  size = 'medium',
  width = 'stretch',
}: ControlSliderProps): ReactNode {
  const sizeKey = DESIGN_SIZES.includes(size) ? size : 'medium';
  return (
    <Box width={width}>
      <fieldset className={buildCls(styles.controlSlider, styles[sizeKey])}>
        {legend && <legend>{legend}</legend>}
        <div className={styles.sliderWrap}>
          <IconButton.Outlined
            name="minus"
            size={sizeKey}
            onClick={() => onChange(Math.max(min, value - step))}
            ariaLabel={decreaseLabel}
            disabled={value <= min}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={ariaLabel}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={ariaValueText}
          />
          <IconButton.Outlined
            name="plus"
            size={sizeKey}
            onClick={() => onChange(Math.min(max, value + step))}
            ariaLabel={increaseLabel}
            disabled={value >= max}
          />
        </div>
        {displayValue && (
          <span className={styles.sliderValue} aria-hidden="true">
            {displayValue}
          </span>
        )}
      </fieldset>
    </Box>
  );
}
