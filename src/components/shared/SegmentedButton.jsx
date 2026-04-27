import { buildCls } from '../../utils/cssUtil';
import styles from './segmentedButton.module.css';

export function SegmentedButton({ options, value, onChange, ariaLabel }) {
  const rootCls = buildCls(styles.segmentedButton, styles.segmentedFieldset);
  return (
    <fieldset className={rootCls}>
      <legend className={styles.segmentedLegend}>{ariaLabel}</legend>
      {options.map((opt) => {
        const segmentCls = buildCls(styles.segment, value === opt.value && styles.active);
        return (
          <button
            key={opt.value}
            type="button"
            className={segmentCls}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            aria-label={opt.ariaLabel ?? opt.label}
          >
            {opt.label}
          </button>
        );
      })}
    </fieldset>
  );
}

export default SegmentedButton;
