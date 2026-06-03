import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@components/layout/Header';
import { ProjectPano } from '@sections/projects/ProjectPano';
import { ProjectCard } from '@sections/projects/ProjectCard';
import ProjectRepository from '../../repositories/project.js';
import styles from './projects.module.css';
import { buildCls } from '../../utils/cssUtil';
import { useResponsive } from '../../hooks/useResponsive';
import { Icon } from '@components/shared/icon/Icon';
import { useConfigStore } from '../../stores/configStore';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { useProjectCardFlipStore } from '../../stores/projectCardFlipStore';
import { parseQuery } from '@sections/projects/search/parseQuery';
import { normalizeStackToken } from '@sections/projects/search/stackMapping';
import { filterProjects, getShowValue } from '@sections/projects/search/filterProjects';
import { stripSortFromParsedClauses } from '@sections/projects/search/stripSort';
import { sortProjectsByMode } from '@sections/projects/search/sortProjects';
import {
  applySortModeToRawQuery,
  getSortModeFromRawQuery,
  nextSortModeAfterClick,
} from '@sections/projects/search/querySortMode';
import { ProjectSearchBar } from '@sections/projects/ProjectSearchBar';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../../hooks/useA11y';
import { useVersionHash } from '../../versioning/VersionContext.jsx';
import { useAnalytics } from '../../hooks/useAnalytics.js';

const MIN_CARD_WIDTH = 300;
const BASE_GAP = 12;

const HEADER_FADE_START_RATIO = 0.82;
const HEADER_FADE_END_RATIO   = 0.50;
const ROW_FADE_START_RATIO    = 0.85;
const ROW_FADE_END_RATIO      = 0.52;
const ROW_TRANSLATE_PX        = 18;
const ROW_GAP_BASE_COLUMNS    = 6;
const ROW_GAP_SCALE           = 6;
const ROW_GAP_MIN_PX          = 20;
const FONT_SCALE_MIN          = 0.82;
const FONT_SCALE_MAX          = 0.98;
const FONT_SCALE_DIVISOR      = 3.85;

function labelForSortMode(mode, t) {
  if (mode == null || mode === 'recent') return t('project.sortOrderRecent');
  if (mode === 'oldest') return t('project.sortOrderOldest');
  return t('project.sortOrderStatus');
}

export function Projects() {
  const { t } = useTranslation();
  const a11y = useA11y();
  const { projectsGridBounds: columnBounds, isMobile } = useResponsive();
  const language = useConfigStore((s) => s.language);
  const versionHash = useVersionHash();
  const { trackUiSpoilerClick } = useAnalytics();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setFlippedProjectId = useProjectCardFlipStore((s) => s.setFlippedProjectId);
  const setQuery = useProjectSearchStore((s) => s.setQuery);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const [projects, setProjects] = useState([]);
  const [columnCount, setColumnCount] = useState(4);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const rowRefs = useRef([]);
  const rowsContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const prevMaxColumnsRef = useRef(null);

  useEffect(() => {
    const repository = new ProjectRepository();
    const fetchData = async () => {
      await repository.load(language || 'en', versionHash);
      const toMonthValue = (project) => {
        const start = project?.period?.start || '';
        const [year, month] = String(start).split('-');
        if (!year || !month) return Number.MIN_SAFE_INTEGER;
        const y = Number(year);
        const m = Number(month);
        if (Number.isNaN(y) || Number.isNaN(m)) return Number.MIN_SAFE_INTEGER;
        return y * 100 + m;
      };

      const sorted = [...repository.all].sort((a, b) => {
        const diff = toMonthValue(b) - toMonthValue(a);
        if (diff !== 0) return diff;
        return (b.id || 0) - (a.id || 0);
      });
      setProjects(sorted);
    };
    fetchData();
  }, [language, versionHash]);

  const searchClauses = useMemo(() => {
    const q = (rawQuery || '').trim();
    if (!q) return [];
    return parseQuery(q, normalizeStackToken);
  }, [rawQuery]);

  const { filterClauses, sortMode } = stripSortFromParsedClauses(searchClauses);

  const visibleProjects = useMemo(() => {
    let list;
    if (!filterClauses.length) list = projects.filter((p) => !p.hidden);
    else list = filterProjects(projects, filterClauses, normalizeStackToken);
    if (sortMode) list = sortProjectsByMode(list, sortMode);
    return list;
  }, [projects, filterClauses, sortMode]);

  const showValue = getShowValue(filterClauses);
  const showHiddenBadge = showValue === 'all' || showValue === 'hidden';

  const searchPool = useMemo(() => {
    if (showValue === 'all') return projects;
    if (showValue === 'hidden') return projects.filter((p) => p.hidden);
    return projects.filter((p) => !p.hidden);
  }, [projects, showValue]);

  const showResultCount = Boolean((rawQuery || '').trim()) || filterClauses.length > 0;

  const parsedSortMode = getSortModeFromRawQuery(rawQuery);
  const sortIconName =
    parsedSortMode === 'oldest' ? 'sort-oldest' : parsedSortMode === 'status' ? 'sort-status' : 'sort-recent';
  const sortCurrentLabel = labelForSortMode(parsedSortMode, t);
  const sortNextLabel = labelForSortMode(nextSortModeAfterClick(parsedSortMode), t);
  const sortUsesNonDefault = parsedSortMode === 'oldest' || parsedSortMode === 'status';

  const rows = useMemo(() => {
    const chunked = [];
    const baselineRows = Math.ceil(visibleProjects.length / Math.max(1, columnBounds.min));
    for (let i = 0; i < visibleProjects.length; i += columnCount) {
      const row = visibleProjects.slice(i, i + columnCount);
      while (row.length < columnCount) row.push(null);
      chunked.push(row);
    }
    while (chunked.length < baselineRows) {
      chunked.push(Array.from({ length: columnCount }, () => null));
    }
    return chunked;
  }, [visibleProjects, columnCount, columnBounds.min]);

  useEffect(() => {
    const handleResize = () => {
      const width = rowsContainerRef.current?.clientWidth ?? window.innerWidth;
      setContainerWidth(width);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const target = rowsContainerRef.current;
    if (!target || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const effectiveBounds = useMemo(() => {
    const theoreticalMax = Math.floor((containerWidth + BASE_GAP) / (MIN_CARD_WIDTH + BASE_GAP));
    const layoutMax = Math.max(1, theoreticalMax);
    let min = columnBounds.min;
    let max = Math.max(columnBounds.min, Math.min(columnBounds.max, layoutMax));
    if (min === max && columnBounds.max > columnBounds.min) {
      min = Math.max(1, columnBounds.min - 1);
    }
    return { min, max };
  }, [columnBounds, containerWidth]);

  useEffect(() => {
    const { min, max } = effectiveBounds;
    const prevMax = prevMaxColumnsRef.current;
    prevMaxColumnsRef.current = max;
    if (prevMax != null && max > prevMax) {
      setColumnCount(max);
      return;
    }
    setColumnCount((prev) => Math.min(max, Math.max(min, prev)));
  }, [effectiveBounds]);

  useEffect(() => {
    const handleProjectsHeaderScroll = () => {
      const windowHeight = window.innerHeight;
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const { top } = sectionEl.getBoundingClientRect();
      const startFade = windowHeight * HEADER_FADE_START_RATIO;
      const endFade = windowHeight * HEADER_FADE_END_RATIO;
      let opacity = 0;
      if (top <= endFade) opacity = 1;
      else if (top < startFade) opacity = (startFade - top) / (startFade - endFade);
      setHeaderOpacity(opacity);
    };

    window.addEventListener('scroll', handleProjectsHeaderScroll);
    handleProjectsHeaderScroll();
    return () => window.removeEventListener('scroll', handleProjectsHeaderScroll);
  }, []);

  useEffect(() => {
    const handleProjectRowsScroll = () => {
      const windowHeight = window.innerHeight;
      rowRefs.current.forEach((row) => {
        if (!row) return;
        const { top } = row.getBoundingClientRect();
        const startFade = windowHeight * ROW_FADE_START_RATIO;
        const endFade = windowHeight * ROW_FADE_END_RATIO;
        let opacity = 0;
        let translateY = ROW_TRANSLATE_PX;
        if (top <= endFade) { opacity = 1; translateY = 0; }
        else if (top >= startFade) { opacity = 0; translateY = ROW_TRANSLATE_PX; }
        else {
          const t = (startFade - top) / (startFade - endFade);
          opacity = t;
          translateY = (1 - t) * ROW_TRANSLATE_PX;
        }
        row.style.opacity = `${opacity}`;
        row.style.transform = `translateY(${translateY}px)`;
      });
    };

    window.addEventListener('scroll', handleProjectRowsScroll);
    handleProjectRowsScroll();
    return () => window.removeEventListener('scroll', handleProjectRowsScroll);
  }, [rows]);

  const handleChangeColumn = (next) =>
    setColumnCount(Math.min(effectiveBounds.max, Math.max(effectiveBounds.min, next)));

  useEffect(() => {
    if (!isMobile) return;
    const clearFlipIfOutside = (e) => {
      const container = rowsContainerRef.current;
      if (!container || container.contains(e.target)) return;
      setFlippedProjectId(null);
    };
    document.addEventListener('touchstart', clearFlipIfOutside, true);
    document.addEventListener('mousedown', clearFlipIfOutside, true);
    return () => {
      document.removeEventListener('touchstart', clearFlipIfOutside, true);
      document.removeEventListener('mousedown', clearFlipIfOutside, true);
    };
  }, [isMobile, setFlippedProjectId]);

  const handleToggleShowHidden = () => {
    trackUiSpoilerClick('show-hidden-toggle');
    const q = (rawQuery || '').trim();
    if (q === 'show:all') return setQuery('');
    return setQueryFromShortcut('show:all');
  };

  const handleSortCycle = () => {
    const nextMode = nextSortModeAfterClick(getSortModeFromRawQuery(rawQuery));
    setQuery(applySortModeToRawQuery(rawQuery, nextMode));
  };

  const projectsHeaderCls = buildCls(styles.projectsHeaderBlock, headerOpacity === 0 && styles.projectsHeaderBlockHidden);
  const showHiddenBtnCls = buildCls(showHiddenBadge && styles.active);
  const sortBtnCls = buildCls(sortUsesNonDefault && styles.active);

  return (
    <div className={styles.projectsContainer} ref={sectionRef}>
      <div
        className={projectsHeaderCls}
        style={{ '--header-opacity': headerOpacity }}
      >
        <div className={styles.projectsHeaderWrap}>
          <div className={styles.projectsHeaderTitle}>
            <Header text="Projects" align="center" />
          </div>
        </div>
        <div className={styles.panoLineFullWidth} aria-hidden="true">
          <ProjectPano />
        </div>
        <div className={styles.controls}>
        <fieldset className={buildCls(styles.visibilityToggle, styles.projectControlsFieldset)}>
          <legend className={styles.projectControlsLegend}>{a11y('project.visibilityToolbar')}</legend>
          <button
            type="button"
            className={showHiddenBtnCls}
            onClick={handleToggleShowHidden}
            aria-label={a11y('project.showHidden')}
            aria-pressed={showHiddenBadge}
            title="show:all"
          >
            <Icon name={showHiddenBadge ? 'eye-open' : 'eye-off'} size="md" aria-hidden />
          </button>
          <button
            type="button"
            className={sortBtnCls}
            onClick={handleSortCycle}
            aria-label={a11y('project.sortCycle', { current: sortCurrentLabel, next: sortNextLabel })}
            title={t('project.sortButtonTitle', { current: sortCurrentLabel, next: sortNextLabel })}
          >
            <Icon name={sortIconName} size="md" aria-hidden />
          </button>
        </fieldset>
        <ProjectSearchBar
          matchedCount={visibleProjects.length}
          totalCount={searchPool.length}
          showResultCount={showResultCount}
        />
        <fieldset className={buildCls(styles.sliderWrap, styles.projectControlsFieldset)}>
          <legend className={styles.projectControlsLegend}>{a11y('project.gridSlider')}</legend>
          <button
            type="button"
            onClick={() => handleChangeColumn(columnCount - 1)}
            aria-label={a11y('project.gridDecrease')}
            disabled={columnCount <= effectiveBounds.min}
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            type="range"
            min={effectiveBounds.min}
            max={effectiveBounds.max}
            value={columnCount}
            onChange={(e) => handleChangeColumn(Number(e.target.value))}
            aria-valuemin={effectiveBounds.min}
            aria-valuemax={effectiveBounds.max}
            aria-valuenow={columnCount}
            aria-valuetext={a11y('project.gridValue', { count: columnCount })}
            aria-label={a11y('project.gridSlider')}
          />
          <button
            type="button"
            onClick={() => handleChangeColumn(columnCount + 1)}
            aria-label={a11y('project.gridIncrease')}
            disabled={columnCount >= effectiveBounds.max}
          >
            <span aria-hidden="true">+</span>
          </button>
        </fieldset>
      </div>
      </div>

      <div className={styles.projectsContentWrap}>
        {visibleProjects.length === 0 && (rawQuery || '').trim() && (
          <p className={styles.searchEmpty}>{t('project.searchEmpty')}</p>
        )}
        <div className={styles.rows} ref={rowsContainerRef}>
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            ref={(el) => { rowRefs.current[rowIndex] = el; }}
            className={styles.row}
            style={{
              '--project-columns': columnCount,
              '--project-gap': `${Math.max(ROW_GAP_MIN_PX, (ROW_GAP_BASE_COLUMNS - columnCount) * ROW_GAP_SCALE)}px`,
              '--card-font-scale': Math.max(FONT_SCALE_MIN, Math.min(FONT_SCALE_MAX, FONT_SCALE_DIVISOR / columnCount)),
            }}
          >
            {row.map((project, colIndex) => (
              project
                ? (
                    <div key={project.id || project.title} id={project.id ? `project-${project.id}` : undefined}>
                      <ProjectCard project={project} showAll={showHiddenBadge} />
                    </div>
                  )
                : <div key={`ghost-${rowIndex}-${colIndex}`} className={styles.cardGhost} aria-hidden="true" />
            ))}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
