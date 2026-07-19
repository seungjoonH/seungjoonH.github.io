import { useCallback, useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

export interface UseModalOptions {
  active: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeDelayMs?: number;
}

export interface UseModalResult {
  requestClose: () => void;
}

/** 모달 하나의 포커스 가두기 + Escape 닫기 + 닫힘 시 포커스 복귀를 전담한다. */
export function useModal(
  containerRef: RefObject<HTMLElement | null>,
  { active, onClose, returnFocusRef, initialFocusRef, closeDelayMs = 0 }: UseModalOptions
): UseModalResult {
  const closingRef = useRef(false);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const finish = () => {
      returnFocusRef?.current?.focus?.();
      onClose();
    };
    if (closeDelayMs > 0) window.setTimeout(finish, closeDelayMs);
    else finish();
  }, [closeDelayMs, onClose, returnFocusRef]);

  useEffect(() => {
    if (!active) return;
    closingRef.current = false;
  }, [active]);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const initialFocusTarget = initialFocusRef?.current;
    if (initialFocusTarget) initialFocusTarget.focus();
    else getFocusables(container)[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = getFocusables(container);
      if (list.length === 0) return;

      const i = list.indexOf(document.activeElement as HTMLElement);
      if (i === -1) {
        e.preventDefault();
        (e.shiftKey ? list[list.length - 1] : list[0]).focus();
        return;
      }
      const next = e.shiftKey ? (list[i - 1] ?? list[list.length - 1]) : (list[i + 1] ?? list[0]);
      e.preventDefault();
      next.focus();
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef, initialFocusRef, requestClose]);

  return { requestClose };
}
