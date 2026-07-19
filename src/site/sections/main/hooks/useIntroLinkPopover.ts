// IntroLink 트리거의 hover/클릭 팝오버 위치·마운트·닫기 로직
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type RefObject,
} from 'react';

const OPEN_DELAY_MS = 140;
const CLOSE_DELAY_MS = 220;
const POPOVER_UNMOUNT_AFTER_MS = 300;

/**
 * CSS 커스텀 프로퍼티(px)를 숫자로 읽는다.
 * @param el - 변수가 선언된 요소
 * @param name - `--foo` 형태 이름
 * @returns 파싱된 px 값. 없거나 NaN이면 0
 */
function readCssPx(el: HTMLElement, name: string): number {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export interface UseIntroLinkPopoverResult {
  open: boolean;
  popoverMounted: boolean;
  popoverEntered: boolean;
  wrapRef: RefObject<HTMLSpanElement>;
  popoverRef: RefObject<HTMLDialogElement>;
  popoverId: string;
  closePopover: () => void;
  handleWrapEnter: () => void;
  handleWrapLeave: (e: MouseEvent | FocusEvent) => void;
  handlePopoverEnter: () => void;
  handlePopoverLeave: (e: MouseEvent | FocusEvent) => void;
  handleTriggerClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function useIntroLinkPopover(): UseIntroLinkPopoverResult {
  const [open, setOpen] = useState(false);
  const [popoverMounted, setPopoverMounted] = useState(false);
  const [popoverEntered, setPopoverEntered] = useState(false);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDialogElement>(null);
  const popoverId = useId();

  function clearTimers() {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
    unmountTimerRef.current = null;
  }

  function closePopover() {
    setOpen(false);
    clearTimers();
  }

  function scheduleOpen() {
    clearTimers();
    openTimerRef.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  }

  function scheduleClose() {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  function updatePopoverPosition() {
    const wrap = wrapRef.current;
    const popover = popoverRef.current;
    if (!wrap || !popover) return;
    const r = wrap.getBoundingClientRect();
    const gap = readCssPx(popover, '--intro-popover-gap');
    const pad = readCssPx(popover, '--intro-popover-viewport-pad');
    const maxWidth = readCssPx(popover, '--intro-popover-max-width');
    const maxLeft = window.innerWidth - pad - maxWidth;
    const left = Math.max(pad, Math.min(r.left, maxLeft));
    const top = Math.max(pad, r.top - gap);
    popover.style.setProperty('--intro-popover-top', `${top}px`);
    popover.style.setProperty('--intro-popover-left', `${left}px`);
  }

  useEffect(() => {
    if (open) {
      if (unmountTimerRef.current) {
        clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
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
    unmountTimerRef.current = setTimeout(() => {
      setPopoverMounted(false);
      unmountTimerRef.current = null;
    }, POPOVER_UNMOUNT_AFTER_MS);
    return () => {
      if (unmountTimerRef.current) {
        clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = null;
      }
    };
  }, [open, popoverEntered, popoverMounted]);

  useLayoutEffect(() => {
    if (!popoverMounted) return undefined;
    updatePopoverPosition();
    window.addEventListener('scroll', updatePopoverPosition, true);
    window.addEventListener('resize', updatePopoverPosition);
    return () => {
      window.removeEventListener('scroll', updatePopoverPosition, true);
      window.removeEventListener('resize', updatePopoverPosition);
    };
  }, [popoverMounted]);

  useEffect(() => {
    if (!open && !popoverMounted) return undefined;
    const onMouseDown = (e: globalThis.MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (wrapRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open, popoverMounted]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  function handleWrapLeave(e: MouseEvent | FocusEvent) {
    const next = e.relatedTarget;
    if (next instanceof Node && popoverRef.current?.contains(next)) {
      clearTimers();
      return;
    }
    scheduleClose();
  }

  function handlePopoverLeave(e: MouseEvent | FocusEvent) {
    const next = e.relatedTarget;
    if (next instanceof Node && wrapRef.current?.contains(next)) return;
    scheduleClose();
  }

  return {
    open,
    popoverMounted,
    popoverEntered,
    wrapRef,
    popoverRef,
    popoverId,
    closePopover,
    handleWrapEnter: scheduleOpen,
    handleWrapLeave,
    handlePopoverEnter: clearTimers,
    handlePopoverLeave,
    handleTriggerClick: (e) => {
      e.preventDefault();
      setOpen((v) => !v);
    },
  };
}
