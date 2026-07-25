// 최대 줄 수(lineCount)와 L1:L2 비율(splitRatio)에 맞춰 폭·공백 분할 / wrap·ellipsis
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import {
  countNaturalWrapLines,
  splitAtSpaceFittingWidth,
  type SplitAtSpaceResult,
} from '@utils/splitAtSpace';
import styles from './lineFitText.module.css';

export interface LineFitTextProps {
  text: string;
  className?: string;
  /**
   * 최대 줄 수.
   * - `1` — 항상 1줄, 넘치면 ellipsis
   * - `2` — 한 줄이면 1줄, 넘치면 공백 분할 2줄, 그래도 안 되면 clamp+ellipsis
   * - `3+` — 한 줄이면 1줄, 넘치면 wrap + line-clamp
   * - `0` — 줄 수 제한 없음. 자연스럽게 정확히 2줄이 되면 공백 분할(splitRatio 적용),
   *   3줄 이상이 필요하면 그냥 자연 wrap (내용 잘림 없음)
   * @default 2
   */
  lineCount?: number;
  /**
   * `lineCount`가 `2`이거나, `lineCount={0}`인데 자연스럽게 정확히 2줄이 될 때
   * 적용되는 L1:L2 목표 비율(0~1, L1 기준).
   * 텍스트가 길어져 폭에 안 들어가면 0.5(50:50)까지 좁혀지다가,
   * 그래도 안 되면 (lineCount=2는) 2줄 clamp+ellipsis, (lineCount=0은) 자연 wrap으로 넘어간다.
   * 그 외 `lineCount` 값에서는 무시된다(개발 모드 콘솔 경고).
   * @default 0.65
   */
  splitRatio?: number;
  /** @deprecated `lineCount={1}` 사용 */
  forceSingleLine?: boolean;
  /**
   * 줄 단위 커스텀 렌더 (하이라이트, 마크업 파싱 등).
   * 공백 분할(`lineCount=2` 또는 `0`의 2줄 케이스)은 원문을 물리적으로 두 조각으로 잘라
   * 각각 따로 렌더하므로, `**bold**` 같은 인라인 마크업이 분할 지점을 가로지르면 깨질 수 있다.
   * 그래서 `renderLine`이 있으면 분할 모드를 쓰지 않고 원문 전체를 한 번에 넘긴다.
   */
  renderLine?: (line: string) => ReactNode;
}

type Layout =
  | { kind: 'one'; text: string }
  | { kind: 'split'; first: string; second: string }
  | { kind: 'clamp'; text: string; lines: number }
  | { kind: 'flow'; text: string };

function measureWithCanvas(font: string): (s: string) => number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return (s) => s.length;
  ctx.font = font;
  return (s) => ctx.measureText(s).width;
}

function resolveLineCount(lineCount: number, forceSingleLine: boolean): number {
  if (forceSingleLine) return 1;
  if (!Number.isFinite(lineCount) || lineCount < 0) return 0;
  return Math.floor(lineCount);
}

function layoutFromSplit(result: SplitAtSpaceResult, clampLines: number): Layout {
  switch (result.mode) {
    case 'single':
      return { kind: 'one', text: result.first };
    case 'double':
      return { kind: 'split', first: result.first, second: result.second ?? '' };
    case 'multi':
      return { kind: 'clamp', text: result.first, lines: clampLines };
  }
}

/** lineCount=0 전용 — 자연스럽게 정확히 2줄이면 비율 분할, 아니면 자연 wrap (잘림 없음) */
function resolveAutoFlowLayout(
  text: string,
  measure: (s: string) => number,
  width: number,
  splitRatio: number,
  hasRenderLine: boolean,
): Layout {
  const trimmed = text.trim();
  if (measure(trimmed) <= width) return { kind: 'one', text: trimmed };

  if (!hasRenderLine && countNaturalWrapLines(trimmed, measure, width) === 2) {
    const result = splitAtSpaceFittingWidth(trimmed, measure, width, splitRatio);
    if (result.mode === 'double') {
      return { kind: 'split', first: result.first, second: result.second ?? '' };
    }
    if (result.mode === 'single') {
      return { kind: 'one', text: result.first };
    }
    // mode 'multi' — 50:50조차 폭에 안 들어가면 그냥 자연 wrap으로 넘어감
  }

  return { kind: 'flow', text: trimmed };
}

function resolveLayout(
  text: string,
  measure: (s: string) => number,
  width: number,
  lineCount: number,
  splitRatio: number,
  hasRenderLine: boolean,
): Layout {
  const trimmed = text.trim();
  if (lineCount === 1) return { kind: 'one', text: trimmed };

  if (width > 0 && measure(trimmed) <= width) {
    return { kind: 'one', text: trimmed };
  }

  if (lineCount === 2) {
    // renderLine이 있으면 원문을 물리적으로 자르지 않는다 (인라인 마크업 보존)
    if (hasRenderLine) return { kind: 'clamp', text: trimmed, lines: 2 };
    return layoutFromSplit(
      splitAtSpaceFittingWidth(trimmed, measure, width, splitRatio),
      2,
    );
  }

  // 3+ — 자연 wrap + clamp (공백 2줄 분할은 lineCount=2 전용)
  return { kind: 'clamp', text: trimmed, lines: lineCount };
}

export function LineFitText({
  text,
  className,
  lineCount = 2,
  splitRatio,
  forceSingleLine = false,
  renderLine,
}: LineFitTextProps): ReactNode {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const effectiveCount = resolveLineCount(lineCount, forceSingleLine);
  const hasRenderLine = renderLine !== undefined;

  useEffect(() => {
    if (import.meta.env.DEV && splitRatio !== undefined && effectiveCount !== 2 && effectiveCount !== 0) {
      console.warn('[LineFitText] splitRatio는 lineCount=0 또는 2에서만 적용됩니다 (무시됨)');
    }
  }, [splitRatio, effectiveCount]);

  const [layout, setLayout] = useState<Layout>(() =>
    effectiveCount === 0
      ? { kind: 'flow', text }
      : effectiveCount === 1
        ? { kind: 'one', text }
        : { kind: 'one', text },
  );

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const recompute = () => {
      const width = el.clientWidth;
      if (effectiveCount === 1) {
        setLayout({ kind: 'one', text: text.trim() });
        return;
      }
      if (width <= 0) {
        if (effectiveCount === 0) setLayout({ kind: 'flow', text: text.trim() });
        return;
      }
      const style = getComputedStyle(el);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const measure = measureWithCanvas(font);

      if (effectiveCount === 0) {
        setLayout(resolveAutoFlowLayout(text, measure, width, splitRatio ?? 0.65, hasRenderLine));
        return;
      }

      setLayout(
        resolveLayout(text, measure, width, effectiveCount, splitRatio ?? 0.65, hasRenderLine),
      );
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, effectiveCount, splitRatio, hasRenderLine]);

  const paint = (line: string) => (renderLine ? renderLine(line) : line);

  switch (layout.kind) {
    case 'one':
      return (
        <span ref={rootRef} className={buildCls(styles.root, styles.lines, className)}>
          <span className={styles.line}>{paint(layout.text)}</span>
        </span>
      );
    case 'split':
      return (
        <span ref={rootRef} className={buildCls(styles.root, styles.lines, className)}>
          <span className={styles.line}>{paint(layout.first)}</span>
          <span className={styles.line}>{paint(layout.second)}</span>
        </span>
      );
    case 'clamp':
      return (
        <span
          ref={rootRef}
          className={buildCls(styles.root, styles.clamp, className)}
          style={
            {
              WebkitLineClamp: layout.lines,
              lineClamp: layout.lines,
            } as CSSProperties
          }
        >
          {paint(layout.text)}
        </span>
      );
    case 'flow':
      return (
        <span ref={rootRef} className={buildCls(styles.root, styles.flow, className)}>
          {paint(layout.text)}
        </span>
      );
  }
}
