// 애니메이션 속도 설정 슬라이더 (configStore 바인딩 완성형)
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { useConfigStore } from '@stores/configStore';
import {
  SCALE_SLIDER_STEP,
  SPEED_SCALE_MAX,
  SPEED_SCALE_MIN,
} from '../../../config';
import type { DesignSize, LayoutWidthProps } from '@components/design/designTokens';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';

export interface SpeedControlSliderProps extends LayoutWidthProps {
  size?: DesignSize;
}

export function SpeedControlSlider({
  size = 'medium',
  width = 'stretch',
}: SpeedControlSliderProps): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const value = useConfigStore((s) => s.speedScale);
  const onChange = useConfigStore((s) => s.setSpeedScale);

  return (
    <ControlSlider
      size={size}
      width={width}
      legend={t('settings.speed')}
      value={value}
      min={SPEED_SCALE_MIN}
      max={SPEED_SCALE_MAX}
      step={SCALE_SLIDER_STEP}
      onChange={onChange}
      displayValue={`${value}x`}
      ariaLabel={a11y('settings.speedSlider', {
        min: SPEED_SCALE_MIN,
        max: SPEED_SCALE_MAX,
        value,
      })}
      ariaValueText={a11y('settings.speedValue', { value })}
      decreaseLabel={a11y('settings.speedDecrease')}
      increaseLabel={a11y('settings.speedIncrease')}
    />
  );
}
