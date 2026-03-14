import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import popupStyles from '@sections/projects/projectDetailPopup.module.css';
import { ExperienceDetailContent } from './ExperienceDetailContent';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from '@components/shared/icon/Icon';
import { buildCls } from '../../utils/cssUtil';

export function ExperienceDetailPopup({ experience, onClose, returnFocusRef }) {
  const { t } = useTranslation();
  const panelRef = useRef(null);

  useFocusTrap(panelRef, true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        returnFocusRef?.current?.focus?.();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, returnFocusRef]);

  const handleClose = () => {
    returnFocusRef?.current?.focus?.();
    onClose();
  };

  return (
    <div
      className={popupStyles.overlay}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-detail-title"
      aria-label={t('experience.detailAria', { company: experience.company })}
    >
      <div ref={panelRef} className={popupStyles.panel} data-popup="experience" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={popupStyles.closeBtn}
          onClick={handleClose}
          aria-label={t('experience.close', '닫기')}
        >
          <Icon name="close" aria-hidden="true" />
        </button>

        <div id="experience-detail-title" className={popupStyles.srOnly}>
          {t('experience.detailAria', { company: experience.company })}
        </div>

        <div className={popupStyles.content}>
          <ExperienceDetailContent experience={experience} />
        </div>
      </div>
    </div>
  );
}
