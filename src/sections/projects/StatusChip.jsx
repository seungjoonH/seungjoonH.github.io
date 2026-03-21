import { useTranslation } from 'react-i18next';
import { buildCls } from '../../utils/cssUtil';
import { isKnownProjectStatus, projectStatusChipVariantClass, projectStatusTranslationKey } from './status/projectStatus';
import styles from './statusChip.module.css';

const VARIANT = {
  card: styles.chipOnImage,
  popup: styles.chipPopup,
};

/**
 * @param {{ status: string | null | undefined; variant?: 'card' | 'popup'; className?: string }} props
 */
export function StatusChip({ status, variant = 'card', className }) {
  const { t } = useTranslation();
  if (status == null || status === '' || !isKnownProjectStatus(status)) return null;
  const i18nKey = projectStatusTranslationKey(status);
  if (!i18nKey) return null;
  const label = t(`project.status.${i18nKey}`);
  const vClass = projectStatusChipVariantClass(status);
  return (
    <span
      className={buildCls(styles.chip, VARIANT[variant], styles[vClass], className)}
      title={label}
    >
      {label}
    </span>
  );
}

export default StatusChip;
