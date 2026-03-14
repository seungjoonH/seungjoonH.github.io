import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import popupStyles from './projectDetailPopup.module.css';
import { ProjectDetailContent } from './ProjectDetailContent';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from '@components/shared/icon/Icon';

export function ProjectDetailPopup({ project, onClose, returnFocusRef }) {
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
      aria-labelledby="project-detail-title"
      aria-label={t('project.detailAria', { title: project.title })}
    >
      <div ref={panelRef} className={popupStyles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={popupStyles.closeBtn}
          onClick={handleClose}
          aria-label={t('project.close')}
        >
          <Icon name="close" aria-hidden="true" />
        </button>

        <div id="project-detail-title" className={popupStyles.srOnly}>
          {t('project.detailAria', { title: project.title })}
        </div>

        <div className={popupStyles.content}>
          <ProjectDetailContent project={project} variant="popup" />
        </div>
      </div>
    </div>
  );
}
