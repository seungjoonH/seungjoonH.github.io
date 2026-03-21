import { useEffect, useRef } from 'react';
import { useA11y } from '../../hooks/useA11y';
import popupStyles from '@sections/projects/projectDetailPopup.module.css';
import { ExperienceDetailContent } from './ExperienceDetailContent';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from '@components/shared/icon/Icon';
import { buildCls } from '../../utils/cssUtil';

export function ExperienceDetailPopup({ experience, onClose, returnFocusRef }) {
  const a11y = useA11y();
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
    <div className={popupStyles.modalRoot}>
      <div
        className={popupStyles.backdrop}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
        aria-hidden="true"
      />
      <div className={popupStyles.panelWrap}>
        <div
          ref={panelRef}
          className={buildCls(popupStyles.panel, popupStyles.panelContentFit)}
          data-popup="experience"
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-detail-title"
          aria-label={a11y('experience.detailDialog', { company: experience.company })}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={popupStyles.closeBtn}
            onClick={handleClose}
            aria-label={a11y('common.close')}
          >
            <Icon name="close" aria-hidden="true" />
          </button>
          <div className={popupStyles.panelInner}>
            <div id="experience-detail-title" className={popupStyles.srOnly}>
              {a11y('experience.detailDialog', { company: experience.company })}
            </div>

            <div className={buildCls(popupStyles.content, popupStyles.contentFit)}>
              <ExperienceDetailContent experience={experience} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
