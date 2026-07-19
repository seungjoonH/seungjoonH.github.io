// 타이포 스케일 설정 슬라이더 (configStore 바인딩 완성형)
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { useConfigStore } from '@stores/configStore';
import {
  SCALE_SLIDER_STEP,
  TYPO_SCALE_MAX,
  TYPO_SCALE_MIN,
} from '../../../config';
import type { DesignSize, LayoutWidthProps } from '@components/design/designTokens';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';

export interface FontScaleControlSliderProps extends LayoutWidthProps {
  size?: DesignSize;
}

export function FontScaleControlSlider({
  size = 'medium',
  width = 'stretch',
}: FontScaleControlSliderProps): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const value = useConfigStore((s) => s.typographyScale);
  const onChange = useConfigStore((s) => s.setTypographyScale);

  return (
    <ControlSlider
      size={size}
      width={width}
      legend={t('settings.fontSize')}
      value={value}
      min={TYPO_SCALE_MIN}
      max={TYPO_SCALE_MAX}
      step={SCALE_SLIDER_STEP}
      onChange={onChange}
      displayValue={`${value}x`}
      ariaLabel={a11y('settings.fontSlider', {
        min: TYPO_SCALE_MIN,
        max: TYPO_SCALE_MAX,
        value,
      })}
      ariaValueText={a11y('settings.fontValue', { value })}
      decreaseLabel={a11y('settings.fontDecrease')}
      increaseLabel={a11y('settings.fontIncrease')}
    />
  );
}
