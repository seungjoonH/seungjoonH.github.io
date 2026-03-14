import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@components/layout/Header';
import { ProjectPano } from '@sections/projects/ProjectPano';
import { ProjectCard } from '@sections/projects/ProjectCard';
import ProjectRepository from '../repositories/project.js';
import styles from './projects.module.css';
import { buildCls } from '../utils/cssUtil';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Icon } from '@components/shared/icon/Icon';
import { useConfigStore } from '../stores/configStore';
import { useProjectSearchStore } from '../stores/projectSearchStore';
import { useProjectCardFlipStore } from '../stores/projectCardFlipStore';
import { parseQuery } from '@sections/projects/search/parseQuery';
import { normalizeStackToken } from '@sections/projects/search/stackMapping';
import { filterProjects, getShowValue } from '@sections/projects/search/filterProjects';
import { ProjectSearchBar } from '@sections/projects/ProjectSearchBar';

const MIN_CARD_WIDTH = 300;
const BASE_GAP = 12;

export function Projects() {
  const { type: breakpointType, projectsGridBounds: columnBounds } = useBreakpoint();
  const language = useConfigStore((s) => s.language);
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setFlippedProjectId = useProjectCardFlipStore((s) => s.setFlippedProjectId);
  const setQuery = useProjectSearchStore((s) => s.setQuery);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const [projects, setProjects] = useState([]);
  const [columnCount, setColumnCount] = useState(4);
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const rowRefs = useRef([]);
  const rowsContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const prevMaxColumnsRef = useRef(null);

  useEffect(() => {
    const repository = new ProjectRepository();
    const fetchData = async () => {
      await repository.load(language || 'en');
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
  }, [language]);

  const searchClauses = useMemo(() => {
    const q = (rawQuery || '').trim();
    if (!q) return [];
    return parseQuery(q, normalizeStackToken);
  }, [rawQuery]);

  const visibleProjects = useMemo(() => {
    if (!searchClauses.length) return projects.filter((p) => !p.hidden);
    return filterProjects(projects, searchClauses, normalizeStackToken);
  }, [projects, searchClauses]);

  const showValue = useMemo(() => getShowValue(searchClauses), [searchClauses]);
  const showHiddenBadge = showValue === 'all' || showValue === 'hidden';

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
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const sectionEl = sectionRef.current;
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        const startFade = windowHeight * 0.82;
        const endFade = windowHeight * 0.5;
        let opacity = 0;
        if (rect.top <= endFade) opacity = 1;
        else if (rect.top < startFade) {
          opacity = (startFade - rect.top) / (startFade - endFade);
        }
        setHeaderOpacity(opacity);
      }
      rowRefs.current.forEach((row) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const startFade = windowHeight * 0.85;
        const endFade = windowHeight * 0.52;

        let opacity = 0;
        let translateY = 18;
        if (rect.top <= endFade) {
          opacity = 1;
          translateY = 0;
        } else if (rect.top >= startFade) {
          opacity = 0;
          translateY = 18;
        } else {
          const t = (startFade - rect.top) / (startFade - endFade);
          opacity = t;
          translateY = (1 - t) * 18;
        }
        row.style.opacity = `${opacity}`;
        row.style.transform = `translateY(${translateY}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rows]);

  const onChangeColumn = (next) => {
    setColumnCount(Math.min(effectiveBounds.max, Math.max(effectiveBounds.min, next)));
  };

  const isMobile = breakpointType === 'mobile';
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

  return (
    <div className={styles.projectsContainer} ref={sectionRef}>
      <div
        className={buildCls(styles.projectsHeaderBlock, headerOpacity === 0 && styles.projectsHeaderBlockHidden)}
        style={{
          opacity: headerOpacity,
          transition: 'opacity 0.35s ease-in-out',
        }}
      >
        <div className={styles.projectsHeaderWrap}>
          <Header text="Projects" align="center" className={styles.projectsHeaderTitle} />
        </div>
        <div className={styles.panoLineFullWidth} aria-hidden="true">
          <ProjectPano />
        </div>
        <div className={styles.controls}>
        <div className={styles.visibilityToggle}>
          <button
            type="button"
            className={buildCls(showHiddenBadge && styles.active)}
            onClick={() => {
              const q = (rawQuery || '').trim();
              if (q === 'show:all') setQuery('');
              else setQueryFromShortcut('show:all');
            }}
            aria-label="숨긴 프로젝트 포함 (show:all)"
            title="show:all"
          >
            <Icon name={showHiddenBadge ? 'eye-open' : 'eye-off'} />
          </button>
        </div>
        <ProjectSearchBar />
        <div className={styles.sliderWrap}>
          <button type="button" onClick={() => onChangeColumn(columnCount - 1)}>-</button>
          <input
            type="range"
            min={effectiveBounds.min}
            max={effectiveBounds.max}
            value={columnCount}
            onChange={(e) => onChangeColumn(Number(e.target.value))}
          />
          <button type="button" onClick={() => onChangeColumn(columnCount + 1)}>+</button>
        </div>
      </div>
      </div>

      <div className={styles.projectsContentWrap}>
      {visibleProjects.length === 0 && (rawQuery || '').trim() ? (
        <p className={styles.searchEmpty}>결과가 없습니다</p>
      ) : null}
      <div className={styles.rows} ref={rowsContainerRef}>
        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            ref={(el) => { rowRefs.current[rowIndex] = el; }}
            className={styles.row}
            style={{
              '--project-columns': columnCount,
              '--project-gap': `${Math.max(20, (6 - columnCount) * 6)}px`,
              '--card-font-scale': Math.max(0.82, Math.min(0.98, 3.85 / columnCount)),
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
