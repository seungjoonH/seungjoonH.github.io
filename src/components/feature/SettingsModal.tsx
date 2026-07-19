// 설정 Feature들을 Modal에 조립하는 Feature 모달
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '@hooks/useAnalytics';
import { Modal } from '@components/interactive/modal/Modal';
import { SpeedControlSlider } from '@components/feature/controlSlider/SpeedControlSlider';
import { FontScaleControlSlider } from '@components/feature/controlSlider/FontScaleControlSlider';
import { LanguageSegmentedButton } from '@components/feature/control/LanguageSegmentedButton';
import { ThemeToggleButton } from '@components/feature/icon/ThemeToggleButton';
import styles from './settingsModal.module.css';

export interface SettingsModalProps {
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** 갤러리 등 — 오버레이 없이 패널만 */
  embedded?: boolean;
}

export function SettingsModal({
  onClose,
  returnFocusRef,
  embedded = false,
}: SettingsModalProps): ReactNode {
  const { t } = useTranslation();
  const { trackSettingsOpen } = useAnalytics();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (embedded) return;
    trackSettingsOpen();
  }, [embedded, trackSettingsOpen]);

  return (
    <Modal
      titleId="settings-title"
      title={t('settings.title')}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      initialFocusRef={titleRef}
      size="compact"
      titleVisible
      embedded={embedded}
    >
      <div className={styles.panelBody}>
        <SpeedControlSlider />
        <FontScaleControlSlider />

        <div className={styles.section}>
          <label>{t('settings.language')}</label>
          <div className={styles.controlStretch}>
            <LanguageSegmentedButton />
          </div>
        </div>

        <div className={styles.section}>
          <label>{t('settings.theme')}</label>
          <div className={styles.controlHug}>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </Modal>
  );
}
