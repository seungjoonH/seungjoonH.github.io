// Responsive — 원칙 + Viewport + CSS만/TS만 예시
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import config, { getDefaultSiteHash, type ScreenSizeType } from '../../config';
import { Chip } from '@components/design/chip/Chip';
import { Icon } from '@components/design/icon/Icon';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { trackEvent } from '@analytics';
import { useConfigStore } from '@stores/configStore';
import { CodeSnippet } from './CodeSnippet';
import {
  buildSnippet,
  buildProjectsGridHookSnippet,
  getGuideExample,
  GUIDE_FOCUS_OPTIONS,
  type GuideFocus,
} from './guideSnippets';
import {
  projectGridEffectiveBounds,
  resolvePano,
  ViewportWireframe,
} from './ViewportWireframe';
import { buildCls } from '@utils/cssUtil';
import styles from './responsive.module.css';

const { widths, screenSizeTypes } = config.breakpoints;

/** wide(≥1700) 이상까지 논리 폭이 나가도록 상한 */
const MAX_LOGICAL_W = 1920;
const MIN_LOGICAL_W = 320;
const MAX_LOGICAL_H = 1080;
const MIN_LOGICAL_H = 240;
const INITIAL_LOGICAL_W = 1280;
const INITIAL_LOGICAL_H = 720;

function resolveBreakpoint(width: number): ScreenSizeType {
  const index = widths.reduce(
    (matchedIndex, minWidth, currentIndex) => (width >= minWidth ? currentIndex + 1 : matchedIndex),
    0,
  );
  return screenSizeTypes[index] ?? 'mobile';
}

function Panel({
  file,
  children,
  className,
}: {
  file: string;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <section className={buildCls(styles.panel, className)}>
      <div className={styles.panelHead}>{file}</div>
      {children}
    </section>
  );
}

export function ResponsiveShowcase(): ReactNode {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sizedRef = useRef(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);
  const [scale, setScale] = useState(0.5);
  const [logicalW, setLogicalW] = useState(INITIAL_LOGICAL_W);
  const [logicalH, setLogicalH] = useState(INITIAL_LOGICAL_H);
  const [hintVisible, setHintVisible] = useState(true);
  const [focus, setFocus] = useState<GuideFocus>('pano');
  const [projectCols, setProjectCols] = useState(4);
  const prevMaxColsRef = useRef<number | null>(null);
  const language = useConfigStore((s) => s.language);

  const type = useMemo(() => resolveBreakpoint(logicalW), [logicalW]);
  const pano = useMemo(() => resolvePano(logicalW), [logicalW]);
  const projectBounds = useMemo(
    () => projectGridEffectiveBounds(logicalW, type),
    [logicalW, type],
  );
  const example = getGuideExample(focus);

  useEffect(() => {
    trackEvent({
      event: 'guide:tab',
      versionHash: getDefaultSiteHash(),
      locale: language,
      entityId: `responsive:${focus}`,
      meta: { page: 'responsive', tab: focus },
      dedupeKey: `guide:tab:responsive:${focus}`,
      cooldownMs: 500,
    });
  }, [focus, language]);

  // useProjectsGrid와 동일 — bounds 확대 시 max로, 그 외엔 clamp
  useEffect(() => {
    const { min, max } = projectBounds;
    const prevMax = prevMaxColsRef.current;
    prevMaxColsRef.current = max;
    if (prevMax != null && max > prevMax) {
      setProjectCols(max);
      return;
    }
    setProjectCols((prev) => Math.min(max, Math.max(min, prev)));
  }, [projectBounds]);

  const snippet = useMemo(
    () =>
      buildSnippet({
        focus,
        type,
        pano,
        widths,
        projectCols,
        projectBounds,
      }),
    [focus, type, pano, projectCols, projectBounds],
  );

  const hookSnippet = useMemo(
    () =>
      focus === 'columns'
        ? buildProjectsGridHookSnippet(type, projectBounds)
        : null,
    [focus, type, projectBounds],
  );

  const syncLogicalFromStage = useCallback(() => {
    const el = stageRef.current;
    if (!el || scale <= 0) return;
    const nextW = Math.round(el.offsetWidth / scale);
    const nextH = Math.round(el.offsetHeight / scale);
    setLogicalW(Math.min(MAX_LOGICAL_W, Math.max(MIN_LOGICAL_W, nextW)));
    setLogicalH(Math.min(MAX_LOGICAL_H, Math.max(MIN_LOGICAL_H, nextH)));
  }, [scale]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;
    const syncScale = () => {
      const available = shell.clientWidth;
      if (available <= 0) return;
      setScale(Math.min(1, available / MAX_LOGICAL_W));
    };
    syncScale();
    const observer = new ResizeObserver(syncScale);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || scale <= 0) return undefined;

    el.style.minWidth = `${MIN_LOGICAL_W * scale}px`;
    el.style.minHeight = `${MIN_LOGICAL_H * scale}px`;
    el.style.maxWidth = '100%';
    el.style.maxHeight = `${MAX_LOGICAL_H * scale}px`;

    if (!sizedRef.current) {
      el.style.width = `${INITIAL_LOGICAL_W * scale}px`;
      el.style.height = `${INITIAL_LOGICAL_H * scale}px`;
      sizedRef.current = true;
      syncLogicalFromStage();
    }
  }, [scale, syncLogicalFromStage]);

  const onResizePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const el = stageRef.current;
    if (!el) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: el.offsetWidth,
      startH: el.offsetHeight,
    };
  };

  const onResizePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const el = stageRef.current;
    const shell = shellRef.current;
    const drag = dragRef.current;
    if (!el || !shell || !drag) return;

    const maxW = shell.clientWidth;
    const maxH = Math.min(MAX_LOGICAL_H * scale, shell.clientHeight || MAX_LOGICAL_H * scale);
    const minW = MIN_LOGICAL_W * scale;
    const minH = MIN_LOGICAL_H * scale;

    const nextW = Math.min(maxW, Math.max(minW, drag.startW + (e.clientX - drag.startX)));
    const nextH = Math.min(maxH, Math.max(minH, drag.startH + (e.clientY - drag.startY)));
    el.style.width = `${nextW}px`;
    el.style.height = `${nextH}px`;

    if (Math.abs(nextW - drag.startW) > 2 || Math.abs(nextH - drag.startH) > 2) {
      setHintVisible(false);
    }
    syncLogicalFromStage();
  };

  const onResizePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }
    syncLogicalFromStage();
  };

  return (
    <>
      <h1 className={styles.title}>Responsive</h1>

      <section className={styles.rule} aria-label="Responsive rule">
        <p className={styles.ruleLine}>
          <span className={styles.ruleKey}>CSS</span>
          <span className={styles.ruleValue}>
            창 크기 변화에 따른 레이아웃/스타일 →{' '}
            <code className={styles.inlineCode}>@media</code>
          </span>
        </p>
        <p className={styles.ruleLine}>
          <span className={styles.ruleKey}>TS</span>
          <span className={styles.ruleValue}>
            창 크기 변화에 따른 동작/인터랙션 → 훅 (
            <code className={styles.inlineCode}>useResponsive</code>, 대응 훅이 내부
            호출)
          </span>
        </p>
      </section>

      <div className={styles.board}>
        <Panel file="Viewport" className={styles.viewportPanel}>
          <div className={styles.viewportBody}>
            <div className={styles.viewportMeta}>
              <span className={styles.viewportValue}>
                {logicalW} × {logicalH}
              </span>
              <Chip.Primary label={type} size="small" />
            </div>

            <div className={styles.focusBar}>
              <SegmentedButton
                ariaLabel="Example"
                width="stretch"
                value={focus}
                options={GUIDE_FOCUS_OPTIONS.map(({ value, label }) => ({ value, label }))}
                onChange={(value) => setFocus(value as GuideFocus)}
              />
            </div>

            <div ref={shellRef} className={styles.stageShell}>
              <div className={styles.stageWrap}>
                <div
                  ref={stageRef}
                  className={styles.stage}
                  data-breakpoint={type}
                >
                  <ViewportWireframe
                    logicalWidth={logicalW}
                    breakpointType={type}
                    scale={scale}
                    focus={example.wireframe}
                    projectCols={projectCols}
                    onProjectColsChange={(next) =>
                      setProjectCols(
                        Math.min(projectBounds.max, Math.max(projectBounds.min, next)),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  className={styles.resizeHandle}
                  aria-label="Resize viewport"
                  onPointerDown={onResizePointerDown}
                  onPointerMove={onResizePointerMove}
                  onPointerUp={onResizePointerUp}
                  onPointerCancel={onResizePointerUp}
                >
                  <span
                    className={buildCls(
                      styles.resizeArrow,
                      hintVisible && styles.resizeArrowHint,
                    )}
                  >
                    <Icon.Outlined name="resize-corner" size="medium" embedded />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <div className={styles.codeColumn}>
          <Panel
            file={`${example.kind.toUpperCase()} / ${example.file}`}
            className={styles.codePanel}
          >
            <div className={styles.panelBody}>
              <CodeSnippet code={snippet} />
            </div>
          </Panel>
          {hookSnippet != null && (
            <Panel file="TS / useProjectsGrid.ts" className={styles.codePanel}>
              <div className={styles.panelBody}>
                <CodeSnippet code={hookSnippet} />
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
