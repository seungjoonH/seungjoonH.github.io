// Intro 문장 인라인 링크 트리거와 액션 팝오버
import { useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './introLinkTrigger.module.css';
import { buildCls } from '@utils/cssUtil';
import { Icon } from '@components/design/icon/Icon';
import { SearchShortcutChipButton } from '@components/feature/chip/SearchShortcutChipButton';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { useIntroLinkDefinition } from '@versioning';
import { useDocsFocusStore } from '@stores/focusIdStore';
import { useA11y } from '@hooks/useA11y';
import { useIntroLinkPopover } from './hooks/useIntroLinkPopover';

const SCROLL_INTO_VIEW_DEFER_MS = 0;

export interface IntroLinkRow {
  query?: string;
  docId?: string;
  targetId?: string;
  label?: string;
  labelKey?: string;
  icon?: string;
}

interface IntroLinkTriggerProps {
  linkId: string;
  label: string;
}

function resolveRowLabel(row: IntroLinkRow, t: (key: string) => string): string {
  if (row.label) return row.label;
  if (row.labelKey) return t(row.labelKey);
  return '';
}

export function IntroLinkTrigger({ linkId, label }: IntroLinkTriggerProps): ReactNode {
  const def = useIntroLinkDefinition(linkId) as { rows: IntroLinkRow[] } | null;
  const { t } = useTranslation();
  const a11y = useA11y();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const setDocIdToFocus = useDocsFocusStore((s) => s.setIdToFocus);
  const {
    open,
    popoverMounted,
    popoverEntered,
    wrapRef,
    popoverRef,
    popoverId,
    closePopover,
    handleWrapEnter,
    handleWrapLeave,
    handlePopoverEnter,
    handlePopoverLeave,
    handleTriggerClick,
  } = useIntroLinkPopover();

  const applyRowAction = useCallback(
    (row: IntroLinkRow) => {
      if (!def) return;
      if (row.docId) {
        setDocIdToFocus(row.docId);
        const el = document.getElementById('docs');
        if (el) {
          setTimeout(
            () => el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
            SCROLL_INTO_VIEW_DEFER_MS
          );
        }
        closePopover();
        return;
      }
      if (row.query) {
        setQueryFromShortcut(row.query);
        closePopover();
        return;
      }
      if (row.targetId) {
        const el = document.getElementById(row.targetId);
        if (el) {
          setTimeout(
            () => el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
            SCROLL_INTO_VIEW_DEFER_MS
          );
        }
        closePopover();
      }
    },
    [def, setQueryFromShortcut, setDocIdToFocus, closePopover]
  );

  if (!def) return <strong>{label}</strong>;

  const popoverFrameCls = buildCls(styles.popoverFrame, popoverEntered && styles.popoverFrameVisible);

  const popoverEl =
    popoverMounted &&
    createPortal(
      <dialog
        ref={popoverRef}
        open
        id={popoverId}
        className={popoverFrameCls}
        aria-label={a11y('introLink.modalLabel')}
        onMouseEnter={handlePopoverEnter}
        onMouseLeave={handlePopoverLeave}
      >
        <div className={styles.popoverInner}>
          <p className={styles.lead}>{t('main.introLink.modalLead')}</p>
          <div className={styles.rowGroup}>
            {def.rows.map((row, i) => {
              const rowLabel = resolveRowLabel(row, t);
              if (row.query) {
                return (
                  <SearchShortcutChipButton
                    key={`${linkId}-${i}`}
                    label={rowLabel}
                    query={row.query}
                    onClick={() => closePopover()}
                  />
                );
              }
              return (
                <button
                  key={`${linkId}-${i}`}
                  type="button"
                  className={styles.rowPill}
                  onClick={() => applyRowAction(row)}
                >
                  <span className={styles.rowPillIcon} aria-hidden="true">
                    <Icon.Primary name={row.icon ?? 'document'} embedded />
                  </span>
                  <span className={styles.rowPillLabel}>{rowLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </dialog>,
      document.body
    );

  return (
    <span
      ref={wrapRef}
      className={styles.wrap}
      onMouseEnter={handleWrapEnter}
      onMouseLeave={handleWrapLeave}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={popoverId}
        aria-haspopup="dialog"
        aria-label={a11y('introLink.openHint')}
        onClick={handleTriggerClick}
      >
        <strong className={styles.triggerLabel}>{label}</strong>
      </button>
      {popoverEl}
    </span>
  );
}

export default IntroLinkTrigger;
