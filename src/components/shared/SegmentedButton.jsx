import { buildCls } from '../../utils/cssUtil';
import styles from './segmentedButton.module.css';

export function SegmentedButton({ options, value, onChange, className, ariaLabel }) {
  return (
    <div
      className={buildCls(styles.segmentedButton, className)}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={buildCls(styles.segment, value === opt.value && styles.active)}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          aria-label={opt.label}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedButton;
