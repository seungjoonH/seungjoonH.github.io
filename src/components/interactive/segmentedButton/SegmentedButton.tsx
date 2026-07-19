// 세그먼트 선택. 바깥 그룹 안에서 선택 항목만 rounded surface로 표시한다.
import type { ReactNode } from 'react';
import { Box } from '@components/layout/box/Box';
import { TextButton } from '@components/interactive/button/TextButton';
import { buildCls } from '@utils/cssUtil';
import styles from './segmentedButton.module.css';
import type { SegmentedButtonProps } from './type';

export function SegmentedButton({
  options,
  value,
  onChange,
  ariaLabel,
  width = 'hug',
}: SegmentedButtonProps): ReactNode {
  const rootCls = buildCls(
    styles.segmentedButton,
    styles.segmentedFieldset,
    width === 'stretch' && styles.stretch
  );
  return (
    <Box width={width}>
      <fieldset className={rootCls}>
        <legend className={styles.segmentedLegend}>{ariaLabel}</legend>
        <div className={styles.segmentRow}>
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <div key={opt.value} className={buildCls(styles.segment, selected && styles.segmentActive)}>
                <TextButton.Primary
                  size="small"
                  shape="rounded"
                  width={width}
                  pressed={selected}
                  ariaLabel={opt.ariaLabel ?? opt.label}
                  onClick={() => onChange(opt.value)}
                >
                  {opt.label}
                </TextButton.Primary>
              </div>
            );
          })}
        </div>
      </fieldset>
    </Box>
  );
}
