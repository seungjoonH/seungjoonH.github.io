// /responsive 가이드 — 원칙 예시 (CSS만 / TS만, 현재 활성 규칙)
import type { ScreenSizeType } from '../../config';

/** 와이어프레임 구간 (Viewport 표시) */
export type GuideWireframe = 'pano' | 'carousel' | 'projects' | 'contact';

/** 원칙 예시 — CSS 레이아웃 vs TS 동작 */
export type GuideFocus = 'pano' | 'contact' | 'touch' | 'columns';

export type GuideKind = 'css' | 'ts';

const ROW_GAP_BASE_COLUMNS = 6;
const ROW_GAP_SCALE = 6;
const ROW_GAP_MIN_PX = 20;

export interface GuideExample {
  value: GuideFocus;
  label: string;
  kind: GuideKind;
  wireframe: GuideWireframe;
  file: string;
}

export const GUIDE_FOCUS_OPTIONS: GuideExample[] = [
  { value: 'pano', label: 'Pano', kind: 'css', wireframe: 'pano', file: 'pano.module.css' },
  { value: 'contact', label: 'Fixed Grid', kind: 'css', wireframe: 'contact', file: 'contact.module.css' },
  { value: 'touch', label: 'Carousel', kind: 'css', wireframe: 'carousel', file: 'experience.module.css' },
  { value: 'columns', label: 'Bounded Grid', kind: 'ts', wireframe: 'projects', file: 'Projects.tsx' },
];

export function getGuideExample(focus: GuideFocus): GuideExample {
  return GUIDE_FOCUS_OPTIONS.find((o) => o.value === focus) ?? GUIDE_FOCUS_OPTIONS[0]!;
}

interface PanoRef {
  file: string;
  width: number;
  height: number;
}

interface SnippetInput {
  focus: GuideFocus;
  type: ScreenSizeType;
  pano: PanoRef;
  widths: number[];
  projectCols: number;
  projectBounds: { min: number; max: number };
}

/** config 숫자 기준. 레이아웃과 스타일: CSS @media만 */
function panoCss(type: ScreenSizeType, pano: PanoRef, widths: number[]): string {
  const [tabletAt, desktopAt, wideAt] = widths;
  const sizeComment = `/* ${pano.width} x ${pano.height} */`;
  if (type === 'mobile') {
    return `.panoLine {
  ${sizeComment}
  mask-image: url('/assets/images/pano-line-mobile.svg');
}`;
  }
  if (type === 'tablet') {
    return `@media (min-width: ${tabletAt}px) {
  .panoLine {
    ${sizeComment}
    mask-image: url('/assets/images/${pano.file}');
  }
}`;
  }
  if (type === 'desktop') {
    return `@media (min-width: ${desktopAt}px) {
  .panoLine {
    ${sizeComment}
    mask-image: url('/assets/images/${pano.file}');
  }
}`;
  }
  return `@media (min-width: ${wideAt}px) {
  .panoLine {
    ${sizeComment}
    mask-image: url('/assets/images/${pano.file}');
  }
}`;
}

function contactCss(type: ScreenSizeType, widths: number[]): string {
  const [tabletAt, desktopAt] = widths;
  if (type === 'mobile') {
    return `.cardGrid {
  grid-template-columns: 1fr;
}`;
  }
  if (type === 'tablet') {
    return `@media (min-width: ${tabletAt}px) {
  .cardGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}`;
  }
  return `@media (min-width: ${desktopAt}px) {
  .cardGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}`;
}

/** Experience 캐러셀 — 카드 폭으로 보이는 개수·양옆 짤림이 갈림 */
function carouselCss(type: ScreenSizeType): string {
  if (type === 'mobile') {
    return `.experienceScroll {
  padding-inline: calc((100% - var(--experience-card-width)) / 2);
}

.experienceCard {
  width: var(--experience-card-width);
}

@media (max-width: 768px) {
  .experienceContainer {
    --experience-card-width: 42vw;
  }
}`;
  }

  if (type === 'tablet') {
    return `.experienceScroll {
  padding-inline: calc((100% - var(--experience-card-width)) / 2);
}

.experienceCard {
  width: var(--experience-card-width);
}

@media (max-width: 900px) {
  .experienceContainer {
    --experience-card-width: 40vw;
  }
}`;
  }

  return `.experienceScroll {
  padding-inline: calc((100% - var(--experience-card-width)) / 2);
  gap: 6vw;
}

.experienceCard {
  width: var(--experience-card-width);
}

.experienceContainer {
  --experience-card-width: 19vw;
}`;
}

function columnsTs(
  projectCols: number,
  projectBounds: { min: number; max: number },
): string {
  const gap = `${Math.max(ROW_GAP_MIN_PX, (ROW_GAP_BASE_COLUMNS - projectCols) * ROW_GAP_SCALE)}px`;
  return `export function Projects() {
  const {
    rowsContainerRef,
    columns, gap, effectiveBounds,
    handleChangeColumn,
  } = useProjectsGrid();

  const style = {
    '--project-columns': columns, // ${projectCols}
    '--project-gap': gap, // ${gap}
  } as CSSProperties;

  return (
    <>
      <ColumnControlSlider
        value={columns} // ${projectCols}
        min={effectiveBounds.min} // ${projectBounds.min}
        max={effectiveBounds.max} // ${projectBounds.max}
        onChange={handleChangeColumn}
      />

      <div
        className={styles.rows}
        ref={rowsContainerRef}
        style={style}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </>
  );
}`;
}

/** Bounded Grid 대응 훅 — 내부에서 useResponsive 호출 */
export function buildProjectsGridHookSnippet(
  type: ScreenSizeType,
  projectBounds: { min: number; max: number },
): string {
  return `export function useProjectsGrid() {
  const { type } = useResponsive(); // ${type}
  const columnBounds = config
    .breakpoints.projectsGrid[type];

  const effectiveBounds = {
    min: columnBounds.min, // ${projectBounds.min}
    max: Math.min(columnBounds.max, layoutMax), // ${projectBounds.max}
  };

  return {
    rowsContainerRef,
    columns, gap,
    effectiveBounds,
    handleChangeColumn,
  };
}`;
}

export function buildSnippet(input: SnippetInput): string {
  const { focus, type, pano, widths, projectCols, projectBounds } = input;
  switch (focus) {
    case 'pano': return panoCss(type, pano, widths);
    case 'contact': return contactCss(type, widths);
    case 'touch': return carouselCss(type);
    case 'columns': return columnsTs(projectCols, projectBounds);
  }
}
