import { useEffect, type RefObject } from 'react';

function isScrollable(el: Element | null): el is HTMLElement {
  if (!el || el.nodeType !== 1) return false;
  const style = window.getComputedStyle(el);
  const oy = style.overflowY;
  if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return false;
  return el.scrollHeight > el.clientHeight;
}

function findScrollableInside(el: Element | null, root: Element): HTMLElement | null {
  let node = el;
  while (node && node !== root) {
    if (isScrollable(node)) return node;
    node = node.parentElement;
  }
  return null;
}

function canScrollInDirection(el: HTMLElement | null, deltaY: number): boolean {
  if (!el) return false;
  if (deltaY > 0) return el.scrollTop + el.clientHeight < el.scrollHeight;
  if (deltaY < 0) return el.scrollTop > 0;
  return false;
}

/** 모달 위에서의 휠 스크롤이 배경 페이지로 새어나가지 않게 막는다. */
export function usePreventBackgroundScroll(
  rootRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Node;
      if (!root.contains(target)) return;
      if (!panel.contains(target)) return;
      const scrollable = findScrollableInside(target as Element, panel);
      if (scrollable && canScrollInDirection(scrollable, e.deltaY)) return;
      e.preventDefault();
    };

    const options: AddEventListenerOptions = { passive: false, capture: true };
    document.addEventListener('wheel', handleWheel, options);
    return () => document.removeEventListener('wheel', handleWheel, options);
  }, [rootRef, panelRef]);
}
