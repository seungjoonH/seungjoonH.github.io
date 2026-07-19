// 짧으면 1줄, 길면 최대 2줄(폭 우선·공백 분할) 텍스트
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { splitAtSpaceFittingWidth, type SplitAtSpaceResult } from '@utils/splitAtSpace';
import styles from './twoLineText.module.css';

export interface TwoLineTextProps {
  text: string;
  className?: string;
  /** true면 항상 1줄 ellipsis */
  forceSingleLine?: boolean;
  /** 줄 단위 커스텀 렌더 (하이라이트 등) */
  renderLine?: (line: string) => ReactNode;
}

function measureWithCanvas(font: string): (s: string) => number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return (s) => s.length;
  ctx.font = font;
  return (s) => ctx.measureText(s).width;
}

export function TwoLineText({
  text,
  className,
  forceSingleLine = false,
  renderLine,
}: TwoLineTextProps): ReactNode {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [parts, setParts] = useState<SplitAtSpaceResult>({ mode: 'single', first: text });

  useLayoutEffect(() => {
    if (forceSingleLine) {
      setParts({ mode: 'single', first: text });
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const recompute = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      const style = getComputedStyle(el);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      setParts(splitAtSpaceFittingWidth(text, measureWithCanvas(font), width, 0.65));
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, forceSingleLine]);

  const paint = (line: string) => (renderLine ? renderLine(line) : line);

  if (forceSingleLine || parts.mode === 'single') {
    return (
      <span ref={rootRef} className={buildCls(styles.root, styles.lines, className)}>
        <span className={styles.line}>{paint(parts.first)}</span>
      </span>
    );
  }

  if (parts.mode === 'wrap') {
    return (
      <span ref={rootRef} className={buildCls(styles.root, styles.wrap, className)}>
        {paint(parts.first)}
      </span>
    );
  }

  return (
    <span ref={rootRef} className={buildCls(styles.root, styles.lines, className)}>
      <span className={styles.line}>{paint(parts.first)}</span>
      {parts.second ? <span className={styles.line}>{paint(parts.second)}</span> : null}
    </span>
  );
}
