import { useEffect } from 'react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusables(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

export function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active || !containerRef?.current) return;

    const container = containerRef.current;
    const focusables = getFocusables(container);
    const first = focusables[0];
    if (first) {
      first.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const list = getFocusables(container);
      if (list.length === 0) return;

      const i = list.indexOf(document.activeElement);
      if (i === -1) {
        e.preventDefault();
        (e.shiftKey ? list[list.length - 1] : list[0]).focus();
        return;
      }
      const next = e.shiftKey ? list[i - 1] ?? list[list.length - 1] : list[i + 1] ?? list[0];
      e.preventDefault();
      next.focus();
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef]);
}
