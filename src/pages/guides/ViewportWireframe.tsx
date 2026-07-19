// Viewport 안 레이아웃 전용 와이어프레임 — Experience/Projects 실동작 골격
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ScreenSizeType } from '../../config';
import config from '../../config';
import { FlipCard } from '@components/interactive/card/FlipCard';
import { ColumnControlSlider } from '@components/feature/controlSlider/ColumnControlSlider';
import { useExperienceSnap } from '@sections/experience/hooks/useExperienceSnap';
import type { GuideWireframe } from './guideSnippets';
import styles from './viewportWireframe.module.css';

export type PanoVariant = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface PanoInfo {
  variant: PanoVariant;
  file: string;
  width: number;
  height: number;
}

/**
 * config.breakpoints 구간과 동일한 pano-line SVG.
 */
export function resolvePano(logicalWidth: number): PanoInfo {
  const [tabletAt, desktopAt, wideAt] = config.breakpoints.widths;
  if (logicalWidth < tabletAt) {
    return { variant: 'mobile', file: 'pano-line-mobile.svg', width: 720, height: 702 };
  }
  if (logicalWidth < desktopAt) {
    return { variant: 'tablet', file: 'pano-line-tablet.svg', width: 1100, height: 702 };
  }
  if (logicalWidth < wideAt) {
    return { variant: 'desktop', file: 'pano-line-desktop.svg', width: 1600, height: 702 };
  }
  return { variant: 'wide', file: 'pano-line-wide.svg', width: 2200, height: 702 };
}

/**
 * Experience 카드 폭 — experience.module.css 변수와 동일.
 */
function experienceLayout(logicalWidth: number): {
  cardWidth: number;
  gap: number;
  padInline: number;
} {
  let widthPct: number;
  let gapPct: number;
  let minPx: number;
  let maxPx: number;

  if (logicalWidth <= 768) {
    widthPct = 42;
    gapPct = 8;
    minPx = 150;
    maxPx = 220;
  } else if (logicalWidth <= 900) {
    widthPct = 40;
    gapPct = 12;
    minPx = 80;
    maxPx = 280;
  } else if (logicalWidth <= 1120) {
    widthPct = 20;
    gapPct = 4;
    minPx = 150;
    maxPx = 220;
  } else {
    widthPct = 19;
    gapPct = 6;
    minPx = 180;
    maxPx = 320;
  }

  const cardWidth = Math.min(maxPx, Math.max(minPx, (logicalWidth * widthPct) / 100));
  const gap = (logicalWidth * gapPct) / 100;
  const padInline = Math.max(0, (logicalWidth - cardWidth) / 2);
  return { cardWidth, gap, padInline };
}

/** useProjectsGrid와 동일한 effectiveBounds (논리 폭 기준) */
export function projectGridEffectiveBounds(
  logicalWidth: number,
  type: ScreenSizeType,
): { min: number; max: number } {
  const columnBounds = config.breakpoints.projectsGrid[type];
  const layoutMax = Math.max(1, Math.floor((logicalWidth + 12) / (300 + 12)));
  let min = columnBounds.min;
  const max = Math.max(columnBounds.min, Math.min(columnBounds.max, layoutMax));
  if (min === max && columnBounds.max > columnBounds.min) {
    min = Math.max(1, columnBounds.min - 1);
  }
  return { min, max };
}

/** 기본 열 수 — bounds.max (넓어질 때 useProjectsGrid와 같이 max로) */
export function projectColumnCount(logicalWidth: number, type: ScreenSizeType): number {
  return projectGridEffectiveBounds(logicalWidth, type).max;
}

/** contact.module.css .cardGrid — breakpoint마다 1/2/4 고정 */
export function contactColumns(logicalWidth: number): number {
  if (logicalWidth <= 768) return 1;
  if (logicalWidth <= 1200) return 2;
  return 4;
}

const EXPERIENCE_CARD_COUNT = 5;
const CONTACT_CARD_COUNT = 4;
const PROJECT_CARD_COUNT = 6;

export interface ViewportWireframeProps {
  logicalWidth: number;
  breakpointType: ScreenSizeType;
  scale: number;
  focus: GuideWireframe;
  projectCols: number;
  onProjectColsChange: (next: number) => void;
}

function WireCarousel({
  logicalWidth,
  isMobile,
  scale,
}: {
  logicalWidth: number;
  isMobile: boolean;
  scale: number;
}): ReactNode {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const exp = experienceLayout(logicalWidth);
  const s = scale > 0 ? scale : 1;

  const { focusedCardIndex } = useExperienceSnap(
    scrollContainerRef,
    cardRefs,
    EXPERIENCE_CARD_COUNT,
    [logicalWidth, isMobile, scale],
  );

  const trackStyle = {
    ['--exp-card-w' as string]: `${exp.cardWidth * s}px`,
    ['--exp-gap' as string]: `${exp.gap * s}px`,
  } as CSSProperties;

  return (
    <section className={styles.block}>
      <div ref={scrollContainerRef} className={styles.carouselViewport}>
        <div className={styles.carouselTrack} style={trackStyle}>
          {!isMobile && (
            <>
              <div className={styles.experienceGhost} aria-hidden="true" />
              <div className={styles.experienceGhost} aria-hidden="true" />
            </>
          )}
          {Array.from({ length: EXPERIENCE_CARD_COUNT }, (_, i) => (
            <div
              key={i}
              className={
                i === focusedCardIndex
                  ? `${styles.experienceCard} ${styles.experienceCardFocused}`
                  : styles.experienceCard
              }
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
          {!isMobile && (
            <>
              <div className={styles.experienceGhost} aria-hidden="true" />
              <div className={styles.experienceGhost} aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function WireProjectGrid({
  logicalWidth,
  breakpointType,
  isMobile,
  columns,
  onColumnsChange,
}: {
  logicalWidth: number;
  breakpointType: ScreenSizeType;
  isMobile: boolean;
  columns: number;
  onColumnsChange: (next: number) => void;
}): ReactNode {
  const [flippedId, setFlippedId] = useState<number | null>(null);
  const bounds = projectGridEffectiveBounds(logicalWidth, breakpointType);

  return (
    <section className={styles.block}>
      <div className={styles.gridToolbar}>
        <div className={styles.columnSliderSlot}>
          <ColumnControlSlider
            value={columns}
            min={bounds.min}
            max={bounds.max}
            onChange={onColumnsChange}
          />
        </div>
      </div>
      <div
        className={styles.projectGrid}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: PROJECT_CARD_COUNT }, (_, i) => {
          const isFlipped = isMobile && flippedId === i;
          return (
            <div key={i} className={styles.projectCardSlot}>
              <FlipCard
                surface
                front={<div className={styles.shellFace} />}
                back={<div className={styles.shellFaceBack} />}
                onOpen={() => undefined}
                ariaLabel={`Project ${i + 1}`}
                flipped={isMobile ? isFlipped : undefined}
                onFlippedChange={
                  isMobile
                    ? (next) => setFlippedId(next ? i : null)
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ViewportWireframe({
  logicalWidth,
  breakpointType,
  scale,
  focus,
  projectCols,
  onProjectColsChange,
}: ViewportWireframeProps): ReactNode {
  const pano = resolvePano(logicalWidth);
  const contactCols = contactColumns(logicalWidth);
  const isMobile = breakpointType === 'mobile';

  return (
    <div className={styles.page}>
      {focus === 'pano' && (
        <section className={styles.block}>
          <div
            className={styles.pano}
            data-pano={pano.variant}
            style={{
              aspectRatio: `${pano.width} / ${pano.height}`,
              ['--pano-mask' as string]: `url("/assets/images/${pano.file}")`,
            }}
          >
            <div className={styles.panoLine} aria-hidden="true" />
          </div>
        </section>
      )}

      {focus === 'carousel' && (
        <WireCarousel logicalWidth={logicalWidth} isMobile={isMobile} scale={scale} />
      )}

      {focus === 'projects' && (
        <WireProjectGrid
          logicalWidth={logicalWidth}
          breakpointType={breakpointType}
          isMobile={isMobile}
          columns={projectCols}
          onColumnsChange={onProjectColsChange}
        />
      )}

      {focus === 'contact' && (
        <section className={styles.block}>
          <div
            className={styles.contactGrid}
            style={{
              gridTemplateColumns: `repeat(${contactCols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: CONTACT_CARD_COUNT }, (_, i) => (
              <div key={i} className={styles.contactCard} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
