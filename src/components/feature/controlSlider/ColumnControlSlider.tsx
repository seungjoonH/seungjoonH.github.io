// 프로젝트 그리드 컬럼 수 슬라이더 (bounds·value는 부모, a11y 소유, legend 없음)
import type { ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import type { DesignSize, LayoutWidthProps } from '@components/design/designTokens';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';

export interface ColumnControlSliderProps extends LayoutWidthProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  size?: DesignSize;
}

export function ColumnControlSlider({
  value,
  min,
  max,
  onChange,
  size = 'small',
  width = 'stretch',
}: ColumnControlSliderProps): ReactNode {
  const a11y = useA11y();

  return (
    <ControlSlider
      size={size}
      width={width}
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      ariaLabel={a11y('project.gridSlider')}
      ariaValueText={a11y('project.gridValue', { count: value })}
      decreaseLabel={a11y('project.gridDecrease')}
      increaseLabel={a11y('project.gridIncrease')}
    />
  );
}
