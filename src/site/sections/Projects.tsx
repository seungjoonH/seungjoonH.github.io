import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '@components/design/heading/Heading';
import { ProjectPano } from '@sections/projects/ProjectPano';
import { ProjectCard } from '@components/feature/card/ProjectCard';
import styles from './projects.module.css';
import { buildCls } from '@utils/cssUtil';
import { IconButton } from '@components/interactive/icon/IconButton';
import { ColumnControlSlider } from '@components/feature/controlSlider/ColumnControlSlider';
import { ProjectSortButton } from '@components/feature/icon/ProjectSortButton';
import { ProjectSearchField } from '@components/feature/field/ProjectSearchField';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { parseQuery } from '@sections/projects/search/parseQuery';
import { normalizeStackToken } from '@sections/projects/search/stackMapping';
import { filterProjects, getShowValue } from '@sections/projects/search/filterProjects';
import { stripSortFromParsedClauses } from '@sections/projects/search/stripSort';
import { sortProjectsByMode } from '@sections/projects/search/sortProjects';
import { useA11y } from '@hooks/useA11y';
import { useAnalytics } from '@hooks/useAnalytics';
import { useProjectsData } from '@sections/projects/hooks/useProjectsData';
import { useProjectsGrid } from '@sections/projects/hooks/useProjectsGrid';
import { useProjectsScrollFade } from '@sections/projects/hooks/useProjectsScrollFade';
import { useProjectCardFlipOutside } from '@sections/projects/hooks/useProjectCardFlipOutside';
import type ProjectModel from '../../models/project';

export function Projects(): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const { trackUiSpoilerClick } = useAnalytics();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQuery = useProjectSearchStore((s) => s.setQuery);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);

  const projects = useProjectsData();
  const {
    columns,
    gap,
    columnBounds,
    effectiveBounds,
    rowsContainerRef,
    handleChangeColumn,
  } = useProjectsGrid();
  useProjectCardFlipOutside();

  const style = {
    '--project-columns': columns,
    '--project-gap': gap,
  } as CSSProperties;

  const searchClauses = useMemo(() => {
    const q = (rawQuery || '').trim();
    if (!q) return [];
    return parseQuery(q, normalizeStackToken);
  }, [rawQuery]);

  const { filterClauses, sortMode } = stripSortFromParsedClauses(searchClauses);

  const visibleProjects = useMemo(() => {
    let list = !filterClauses.length
      ? projects.filter((p) => !p.hidden)
      : filterProjects(projects, filterClauses, normalizeStackToken);
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

  const rows = useMemo(() => {
    const chunked: (ProjectModel | null)[][] = [];
    const baselineRows = Math.ceil(visibleProjects.length / Math.max(1, columnBounds.min));
    for (let i = 0; i < visibleProjects.length; i += columns) {
      const row: (ProjectModel | null)[] = visibleProjects.slice(i, i + columns);
      while (row.length < columns) row.push(null);
      chunked.push(row);
    }
    while (chunked.length < baselineRows) {
      chunked.push(Array.from({ length: columns }, () => null));
    }
    return chunked;
  }, [visibleProjects, columns, columnBounds.min]);

  const { rowRefs, sectionRef, headerRef } = useProjectsScrollFade(rows);

  const handleToggleShowHidden = () => {
    trackUiSpoilerClick('show-hidden-toggle');
    const q = (rawQuery || '').trim();
    if (q === 'show:all') return setQuery('');
    return setQueryFromShortcut('show:all');
  };

  return (
    <div className={styles.projectsContainer} ref={sectionRef}>
      <div className={styles.projectsHeaderBlock} ref={headerRef}>
        <div className={styles.projectsHeaderWrap}>
          <div className={styles.projectsHeaderTitle}>
            <Heading text="Projects" align="center" />
          </div>
        </div>
        <div className={styles.panoLineFullWidth} aria-hidden="true">
          <ProjectPano />
        </div>
        <div className={styles.controls}>
          <fieldset className={buildCls(styles.visibilityToggle, styles.projectControlsFieldset)}>
            <legend className={styles.projectControlsLegend}>{a11y('project.visibilityToolbar')}</legend>
            <IconButton.Primary
              pressed={showHiddenBadge}
              name={showHiddenBadge ? 'eye-open' : 'eye-off'}
              onClick={handleToggleShowHidden}
              ariaLabel={a11y('project.showHidden')}
              title="show:all"
            />
            <ProjectSortButton />
          </fieldset>
          <ProjectSearchField
            matchedCount={visibleProjects.length}
            totalCount={searchPool.length}
            showResultCount={showResultCount}
          />
          <div className={styles.columnSliderSlot}>
            <ColumnControlSlider
              value={columns}
              min={effectiveBounds.min}
              max={effectiveBounds.max}
              onChange={handleChangeColumn}
            />
          </div>
        </div>
      </div>

      <div className={styles.projectsContentWrap}>
        {visibleProjects.length === 0 && (rawQuery || '').trim() && (
          <p className={styles.searchEmpty}>{t('project.searchEmpty')}</p>
        )}
        <div className={styles.rows} ref={rowsContainerRef} data-project-rows="" style={style}>
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              ref={(el) => {
                rowRefs.current[rowIndex] = el;
              }}
              className={styles.row}
            >
              {row.map((project, colIndex) =>
                project ? (
                  <div key={project.id || project.title} id={project.id ? `project-${project.id}` : undefined}>
                    <ProjectCard project={project} showAll={showHiddenBadge} />
                  </div>
                ) : (
                  <div key={`ghost-${rowIndex}-${colIndex}`} className={styles.cardGhost} aria-hidden="true" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
