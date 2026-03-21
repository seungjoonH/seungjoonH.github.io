import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styles from './introLinkTrigger.module.css';
import { buildCls } from '../../utils/cssUtil';
import { Icon } from '../../components/shared/icon/Icon';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { getIntroLinkDefinition } from './introLinksConfig';
import { useA11y } from '../../hooks/useA11y';

const OPEN_DELAY_MS = 140;
const CLOSE_DELAY_MS = 220;
const POPOVER_UNMOUNT_AFTER_MS = 300;

export function IntroLinkTrigger({ linkId, label }) {
  const def = getIntroLinkDefinition(linkId);
  const { t } = useTranslation();
  const a11y = useA11y();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const [open, setOpen] = useState(false);
  const [popoverMounted, setPopoverMounted] = useState(false);
  const [popoverEntered, setPopoverEntered] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
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
    setCoords({
      top: r.bottom + 6,
      right: Math.max(8, window.innerWidth - r.right),
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
    const onReflow = () => updatePopoverPosition();
    window.addEventListener('scroll', onReflow, true);
    window.addEventListener('resize', onReflow);
    return () => {
      window.removeEventListener('scroll', onReflow, true);
      window.removeEventListener('resize', onReflow);
    };
  }, [popoverMounted, updatePopoverPosition]);

  const handleWrapEnter = useCallback(() => scheduleOpen(), [scheduleOpen]);

  const handleWrapLeave = useCallback(
    (e) => {
      const next = e.relatedTarget;
      if (popoverRef.current && next instanceof Node && popoverRef.current.contains(next)) {
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
    const onDoc = (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (wrapRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, popoverMounted]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const applyRowAction = useCallback(
    (row) => {
      if (!def) return;
      if (row.query) {
        setQueryFromShortcut(row.query);
        setOpen(false);
        clearTimers();
        return;
      }
      if (row.targetId) {
        const el = document.getElementById(row.targetId);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
        setOpen(false);
        clearTimers();
      }
    },
    [def, setQueryFromShortcut, clearTimers]
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

  const popoverPositionStyle = useMemo(
    () => ({ top: coords.top, right: coords.right }),
    [coords.top, coords.right]
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (!def) return <strong>{label}</strong>;

  const popoverEl =
    popoverMounted &&
    createPortal(
      <div
        ref={popoverRef}
        id={popoverId}
        className={buildCls(styles.popoverFrame, popoverEntered && styles.popoverFrameVisible)}
        style={popoverPositionStyle}
        role="dialog"
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
                <Icon name={row.icon ?? 'search'} className={styles.rowPillIcon} aria-hidden="true" />
                <span className={styles.rowPillLabel}>{t(row.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>,
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
        className={buildCls(styles.trigger)}
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
