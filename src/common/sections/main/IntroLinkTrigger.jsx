import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './introLinkTrigger.module.css';
import { buildCls } from '../../../utils/cssUtil';
import { Icon } from '../../../components/shared/icon/Icon';
import { useProjectSearchStore } from '../../../stores/projectSearchStore';
import { useIntroLinkDefinition } from '../../../versioning/IntroLinksContext.jsx';
import { useDocsFocusStore } from '../../../stores/docsFocusStore.js';
import { useA11y } from '../../../hooks/useA11y';

const OPEN_DELAY_MS = 140;
const CLOSE_DELAY_MS = 220;
const POPOVER_UNMOUNT_AFTER_MS = 300;
const POPOVER_GAP_ABOVE_TRIGGER_PX = 10;
const POPOVER_MIN_VIEWPORT_TOP_PX = 8;
const POPOVER_MIN_VIEWPORT_SIDE_PX = 8;
const POPOVER_MAX_WIDTH_PX = 420;
const SCROLL_INTO_VIEW_DEFER_MS = 0;

export function IntroLinkTrigger({ linkId, label }) {
  const def = useIntroLinkDefinition(linkId);
  const { t } = useTranslation();
  const a11y = useA11y();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const setDocIdToFocus = useDocsFocusStore((s) => s.setDocIdToFocus);
  const [open, setOpen] = useState(false);
  const [popoverMounted, setPopoverMounted] = useState(false);
  const [popoverEntered, setPopoverEntered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const popoverUnmountTimerRef = useRef(null);
  const wrapRef = useRef(null);
  const popoverRef = useRef(null);
  const popoverId = useId();

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (popoverUnmountTimerRef.current) clearTimeout(popoverUnmountTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
    popoverUnmountTimerRef.current = null;
  }, []);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimerRef.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  }, [clearTimers]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [clearTimers]);

  const updatePopoverPosition = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const maxLeft = window.innerWidth - POPOVER_MIN_VIEWPORT_SIDE_PX - POPOVER_MAX_WIDTH_PX;
    const clampedLeft = Math.max(
      POPOVER_MIN_VIEWPORT_SIDE_PX,
      Math.min(r.left, maxLeft)
    );
    setCoords({
      top: Math.max(POPOVER_MIN_VIEWPORT_TOP_PX, r.top - POPOVER_GAP_ABOVE_TRIGGER_PX),
      left: clampedLeft,
    });
  }, []);

  useEffect(() => {
    if (open) {
      if (popoverUnmountTimerRef.current) {
        clearTimeout(popoverUnmountTimerRef.current);
        popoverUnmountTimerRef.current = null;
      }
      setPopoverMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPopoverEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setPopoverEntered(false);
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!popoverMounted || open || popoverEntered) return undefined;
    popoverUnmountTimerRef.current = setTimeout(() => {
      setPopoverMounted(false);
      popoverUnmountTimerRef.current = null;
    }, POPOVER_UNMOUNT_AFTER_MS);
    return () => {
      if (popoverUnmountTimerRef.current) {
        clearTimeout(popoverUnmountTimerRef.current);
        popoverUnmountTimerRef.current = null;
      }
    };
  }, [open, popoverEntered, popoverMounted]);

  useLayoutEffect(() => {
    if (!popoverMounted) return undefined;
    updatePopoverPosition();
    const handleReflow = () => updatePopoverPosition();
    window.addEventListener('scroll', handleReflow, true);
    window.addEventListener('resize', handleReflow);
    return () => {
      window.removeEventListener('scroll', handleReflow, true);
      window.removeEventListener('resize', handleReflow);
    };
  }, [popoverMounted, updatePopoverPosition]);

  const handleWrapEnter = useCallback(() => scheduleOpen(), [scheduleOpen]);

  const handleWrapLeave = useCallback(
    (e) => {
      const next = e.relatedTarget;
      const isFocusInsidePopover =
        next instanceof Node && popoverRef.current?.contains(next);
      if (isFocusInsidePopover) {
        clearTimers();
        return;
      }
      scheduleClose();
    },
    [clearTimers, scheduleClose]
  );

  const handlePopoverEnter = useCallback(() => clearTimers(), [clearTimers]);

  const handlePopoverLeave = useCallback(
    (e) => {
      const next = e.relatedTarget;
      if (wrapRef.current && next instanceof Node && wrapRef.current.contains(next)) return;
      scheduleClose();
    },
    [scheduleClose]
  );

  const handleTriggerClick = useCallback((e) => {
    e.preventDefault();
    setOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!open && !popoverMounted) return undefined;
    const handleDocMouseDown = (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (wrapRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleDocMouseDown);
    return () => document.removeEventListener('mousedown', handleDocMouseDown);
  }, [open, popoverMounted]);

  useEffect(() => {
    if (!open) return undefined;
    const handleDocKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleDocKeyDown);
    return () => document.removeEventListener('keydown', handleDocKeyDown);
  }, [open]);

  const applyRowAction = useCallback(
    (row) => {
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
        setOpen(false);
        clearTimers();
        return;
      }
      if (row.query) {
        setQueryFromShortcut(row.query);
        setOpen(false);
        clearTimers();
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
        setOpen(false);
        clearTimers();
      }
    },
    [def, setQueryFromShortcut, setDocIdToFocus, clearTimers]
  );

  const handlePillClick = useCallback(
    (e) => {
      const rowIndex = Number(e.currentTarget.dataset.rowIndex);
      const row = def?.rows[rowIndex];
      if (!row) return;
      applyRowAction(row);
    },
    [def, applyRowAction]
  );

  const popoverFrameStyle = useMemo(
    () => ({
      '--intro-popover-top': `${coords.top}px`,
      '--intro-popover-left': `${coords.left}px`,
    }),
    [coords.top, coords.left]
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (!def) return <strong>{label}</strong>;

  const popoverFrameCls = buildCls(styles.popoverFrame, popoverEntered && styles.popoverFrameVisible);
  const triggerCls = buildCls(styles.trigger);

  const popoverEl =
    popoverMounted &&
    createPortal(
      <dialog
        ref={popoverRef}
        open
        id={popoverId}
        className={popoverFrameCls}
        style={popoverFrameStyle}
        aria-label={a11y('introLink.popupLabel')}
        onMouseEnter={handlePopoverEnter}
        onMouseLeave={handlePopoverLeave}
      >
        <div className={styles.popoverInner}>
          <p className={styles.lead}>{t('main.introLink.popupLead')}</p>
          <div className={styles.rowGroup}>
            {def.rows.map((row, i) => (
              <button
                key={`${linkId}-${i}`}
                type="button"
                className={styles.rowPill}
                data-row-index={i}
                onClick={handlePillClick}
              >
                <span className={styles.rowPillIcon} aria-hidden="true">
                  <Icon name={row.icon ?? 'search'} />
                </span>
                <span className={styles.rowPillLabel}>
                  {row.label ?? (row.labelKey ? t(row.labelKey) : '')}
                </span>
              </button>
            ))}
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
        className={triggerCls}
        aria-expanded={open}
        aria-controls={popoverId}
        aria-haspopup="dialog"
        aria-label={a11y('introLink.openHint')}
        onClick={handleTriggerClick}
      >
        <strong>{label}</strong>
      </button>
      {popoverEl}
    </span>
  );
}
