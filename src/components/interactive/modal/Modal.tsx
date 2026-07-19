// 포커스 트랩·백드롭·닫기 버튼을 갖춘 공통 모달
import { useRef, useState, type ReactNode } from 'react';
import { useModal } from '@hooks/useModal';
import { useA11y } from '@hooks/useA11y';
import { buildCls } from '@utils/cssUtil';
import { IconButton } from '@components/interactive/icon/IconButton';
import { usePreventBackgroundScroll } from './usePreventBackgroundScroll';
import styles from './modal.module.css';
import type { ModalProps } from './type';

export function Modal({
  titleId,
  title,
  onClose,
  returnFocusRef,
  initialFocusRef,
  closeDelayMs = 0,
  fitContent = false,
  size = 'default',
  titleVisible = false,
  embedded = false,
  children,
}: ModalProps): ReactNode {
  const a11y = useA11y();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const { requestClose } = useModal(panelRef, {
    active: !embedded,
    initialFocusRef,
    returnFocusRef,
    closeDelayMs,
    onClose,
  });
  usePreventBackgroundScroll(embedded ? { current: null } : rootRef, panelRef);

  const handleRequestClose = () => {
    if (closeDelayMs > 0) setIsClosing(true);
    requestClose();
  };

  const panelCls = buildCls(
    styles.panel,
    fitContent && styles.panelContentFit,
    size === 'compact' && styles.panelCompact
  );
  const panelInnerCls = buildCls(styles.panelInner, isClosing && styles.panelInnerClosing);
  const backdropCls = buildCls(styles.backdrop, isClosing && styles.backdropClosing);
  const contentCls = buildCls(styles.content, fitContent && styles.contentFit);

  return (
    <div
      ref={rootRef}
      className={buildCls(styles.modalRoot, embedded && styles.modalRootEmbedded)}
    >
      {!embedded && (
        <div
          className={backdropCls}
          onClick={(e) => e.target === e.currentTarget && handleRequestClose()}
          aria-hidden="true"
        />
      )}
      <div className={buildCls(styles.panelWrap, embedded && styles.panelWrapEmbedded)}>
        <dialog
          ref={panelRef}
          open
          className={panelCls}
          aria-modal={embedded ? undefined : 'true'}
          aria-labelledby={titleId}
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={styles.closeSlot}>
            <IconButton.Primary
              name="close"
              onClick={handleRequestClose}
              ariaLabel={a11y('common.close')}
            />
          </span>
          <div className={panelInnerCls}>
            {titleVisible ? (
              <h2
                id={titleId}
                className={styles.visibleTitle}
                tabIndex={-1}
                ref={(el) => {
                  if (!initialFocusRef) return;
                  (initialFocusRef as { current: HTMLElement | null }).current = el;
                }}
              >
                {title}
              </h2>
            ) : (
              <div id={titleId} className={styles.srOnly}>
                {title}
              </div>
            )}
            <div className={contentCls}>{children}</div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
