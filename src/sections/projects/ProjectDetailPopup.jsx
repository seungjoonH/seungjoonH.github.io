import { useEffect, useRef, useState } from 'react';
import { useA11y } from '../../hooks/useA11y';
import popupStyles from './projectDetailPopup.module.css';
import { ProjectDetailContent } from './ProjectDetailContent';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from '@components/shared/icon/Icon';
import { buildCls } from '../../utils/cssUtil';

function isScrollable(el) {
  if (!el || el.nodeType !== 1) return false;
  const style = window.getComputedStyle(el);
  const oy = style.overflowY;
  if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return false;
  return el.scrollHeight > el.clientHeight;
}

function findScrollableInside(el, root) {
  let node = el;
  while (node && node !== root) {
    if (isScrollable(node)) return node;
    node = node.parentElement;
  }
  return null;
}

function canScrollInDirection(el, deltaY) {
  if (!el) return false;
  if (deltaY > 0) return el.scrollTop + el.clientHeight < el.scrollHeight;
  if (deltaY < 0) return el.scrollTop > 0;
  return false;
}

export function ProjectDetailPopup({ project, onClose, returnFocusRef }) {
  const a11y = useA11y();
  const panelRef = useRef(null);
  const modalRootRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  useFocusTrap(panelRef, true);

  useEffect(() => {
    const modalRoot = modalRootRef.current;
    const panel = panelRef.current;
    if (!modalRoot || !panel) return;

    const handleWheel = (e) => {
      if (!modalRoot.contains(e.target)) return;
      if (!panel.contains(e.target)) return;
      const scrollable = findScrollableInside(e.target, panel);
      if (scrollable && canScrollInDirection(scrollable, e.deltaY)) return;
      e.preventDefault();
    };
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      document.removeEventListener('wheel', handleWheel, { passive: false, capture: true });
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, returnFocusRef]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      returnFocusRef?.current?.focus?.();
      onClose();
    }, 250);
  };

  const backdropClassName = buildCls(popupStyles.backdrop, isClosing && popupStyles.backdropClosing);
  const panelInnerClassName = buildCls(
    popupStyles.panelInner,
    isClosing && popupStyles.panelInnerClosing
  );

  return (
    <div ref={modalRootRef} className={popupStyles.modalRoot}>
      <div
        className={backdropClassName}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
        aria-hidden="true"
      />
      <div className={popupStyles.panelWrap}>
        <div
          ref={panelRef}
          className={popupStyles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
          aria-label={a11y('project.detailDialog', { title: project.title })}
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
          <div className={panelInnerClassName}>
            <div id="project-detail-title" className={popupStyles.srOnly}>
              {a11y('project.detailDialog', { title: project.title })}
            </div>

            <div className={popupStyles.content}>
              <ProjectDetailContent project={project} variant="popup" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
