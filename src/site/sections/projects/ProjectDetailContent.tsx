// 프로젝트 상세 카드/팝업 본문 렌더
import { useMemo, type MouseEvent } from 'react';
import ProjectModel from '../../../models/project';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import cardStylesModule from './projectCard.module.css';
import { buildCls } from '@utils/cssUtil';
import { Icon } from '@components/design/icon/Icon';
import { StackChipButton } from '@components/composed/chip/StackChipButton';
import { TagButton } from '@components/interactive/tag/TagButton';
import { linkIconNameByType } from './utils/linkLabels';
import { renderRichText, renderLinkTitle } from './utils/richText';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { parseQuery } from './search/parseQuery';
import { normalizeStackToken, getStackIconName } from './search/stackMapping';
import { getHighlightTerms, getEffectiveTagsSorted, getEffectiveStacksSorted, highlightText, highlightRichText } from './search/highlight';
import { useDocs } from '@sections/docs/useDocs';
import { isStackMatchedByQuery } from './search/filterProjects';
import { TwoLineText } from '@components/composed/text/TwoLineText';
import { useResponsive } from '@hooks/useResponsive';
import { useConfigStore } from '@stores/configStore';
import config from '../../../config';
import { getMaxVisibleChips } from './getMaxVisibleChips';
import { useStackChipsOverflow } from './hooks/useStackChipsOverflow';
import { StatusChip } from './StatusChip';
import { PROJECT_STATUS } from './status/projectStatus';
import { useAnalytics } from '@hooks/useAnalytics';
import { TypedExternalLink } from '@components/composed/link/TypedExternalLink';
import { typedExternalLinkStyles as linkStyles } from '@components/composed/link/TypedExternalLink';
import {
  getLinkSurface,
  resolveDeployLabel,
  resolveLink,
  renderSectionItem,
  type ProjectLink,
  type ProjectSection,
} from './projectDetailSections';

interface ProjectDetailContentProps {
  project: ProjectModel;
  variant: 'card' | 'modal';
}

export function ProjectDetailContent({ project, variant }: ProjectDetailContentProps) {
  const styles = cardStylesModule;
  const { t } = useTranslation();
  const a11y = useA11y();
  const docs = useDocs();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const appendShortcutToQuery = useProjectSearchStore((s) => s.appendShortcutToQuery);
  const parsedClauses = useMemo(
    () => (rawQuery ? parseQuery(String(rawQuery).trim(), normalizeStackToken) : []),
    [rawQuery]
  );
  const { titleTerms, descTerms } = useMemo(() => getHighlightTerms(parsedClauses), [parsedClauses]);
  const effectiveTags = useMemo(
    () => getEffectiveTagsSorted(project.tags || [], project.tagNames || [], parsedClauses),
    [project.tags, project.tagNames, parsedClauses]
  );
  const effectiveStacks = useMemo(
    () => getEffectiveStacksSorted(project.techStacks || [], project.techStackNames || [], parsedClauses),
    [project.techStacks, project.techStackNames, parsedClauses]
  );

  const projectLinks = useMemo(
    () => (project.links || project.relatedLinks || []).filter((link): link is ProjectLink => !!(link as ProjectLink)?.type),
    [project.links, project.relatedLinks],
  );
  const titleIconLinks = useMemo(
    () => projectLinks.filter((link) => getLinkSurface(link.type) === 'titleIcon'),
    [projectLinks]
  );
  const deployTextLinks = useMemo(
    () => projectLinks.filter((link) => getLinkSurface(link.type) === 'deployText'),
    [projectLinks]
  );
  const stopIfCard = variant === 'card' ? (e: MouseEvent) => e.stopPropagation() : undefined;

  const { type: breakpointType, isMobile } = useResponsive();
  const { trackSkillClick } = useAnalytics();
  const typographyScale = useConfigStore((s) => s.typographyScale) ?? config.typography.scale;
  const { maxTags: maxVisibleTags, maxStacks: maxVisibleStacks } = getMaxVisibleChips(breakpointType, typographyScale);
  const tagsToShow = variant === 'card' ? effectiveTags.tags.slice(0, maxVisibleTags) : effectiveTags.tags;
  const stacksToShow = variant === 'card' ? effectiveStacks.stacks.slice(0, maxVisibleStacks) : effectiveStacks.stacks;
  const { useEvenSplit, lineRef, chipsContainerRef } = useStackChipsOverflow(stacksToShow.length);

  const headWrapCls = buildCls(variant === 'modal' && styles.modalHead, variant !== 'modal' && styles.backHeadWrap);
  const periodRowCls = buildCls(styles.periodRow, variant === 'modal' && styles.periodRowModal);
  const backHeadTopCls = buildCls(styles.backHeadTop, variant === 'modal' && styles.modal);

  const stacksForLine = stacksToShow;
  const stackTwoRows = useEvenSplit && stacksForLine.length >= 2;
  const stackRow1 = stackTwoRows ? stacksForLine.slice(0, Math.floor(stacksForLine.length / 2)) : stacksForLine;
  const stackRow2 = stackTwoRows ? stacksForLine.slice(Math.floor(stacksForLine.length / 2)) : [];

  const handleDetailStackClick = (stack: string) => (e: MouseEvent) => {
    e.stopPropagation();
    trackSkillClick(stack);
    appendShortcutToQuery(`stack:"${stack}"`);
  };

  const renderDetailStackChip = (stack: string) => {
    const matched = isStackMatchedByQuery(stack, parsedClauses, normalizeStackToken);
    return (
      <StackChipButton
        key={stack}
        label={stack}
        iconName={getStackIconName(stack)}
        matched={matched}
        onClick={handleDetailStackClick(stack)}
        ariaLabel={a11y('project.searchByStack', { stack })}
      />
    );
  };

  let stackChipsLine;
  if (stacksForLine.length === 0) {
    stackChipsLine = <span className={styles.languageStacks}>-</span>;
  } else if (stackTwoRows) {
    stackChipsLine = (
      <span className={styles.languageStacksTwoRows}>
        <span className={styles.languageStacksRow}>{stackRow1.map(renderDetailStackChip)}</span>
        <span className={styles.languageStacksRow}>{stackRow2.map(renderDetailStackChip)}</span>
      </span>
    );
  } else {
    stackChipsLine = (
      <span ref={chipsContainerRef} className={styles.languageStacks}>
        {stackRow1.map(renderDetailStackChip)}
      </span>
    );
  }

  return (
    <>
      <div className={headWrapCls}>
      <div className={styles.backHead}>
        <div className={backHeadTopCls}>
          <h4 className={styles.projectType}>{project.typeLabel}</h4>
          <div className={styles.backHeadRight}>
            <div className={periodRowCls}>
              <div className={styles.period}>{project.periodLabel}</div>
              {variant === 'modal' && <StatusChip type={project.status} />}
            </div>
            <div className={styles.teamIcons} aria-hidden="true">
              {Array.from({ length: project.teamSize }).map((_, i) => (
                <span key={i} className={styles.teamIconSlot}>
                  <Icon.Primary name="person" embedded />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.backTitleRow}>
          <h3 title={project.title}>
            {titleTerms.length ? highlightText(project.title || '', titleTerms, styles.highlight) : (project.title || '')}
          </h3>
          <div className={styles.titleLinksRow} onClick={stopIfCard}>
            <div className={styles.titleLinks}>
              {titleIconLinks.map((link, idx) => {
                const r = resolveLink(link, docs);
                if (!r) return null;
                const iconName = linkIconNameByType(link.type);
                return r.href ? (
                  <a
                    key={`title-link-${idx}`}
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={a11y('project.titleLink', { title: r.title || r.typeLabel })}
                    title={r.title || r.typeLabel}
                  >
                    {iconName && <Icon.Primary name={iconName} embedded />}
                  </a>
                ) : (
                  <span
                    key={`title-link-${idx}`}
                    className={styles.titleLinkDisabled}
                    aria-label={a11y('project.titleLink', { title: r.title || r.typeLabel })}
                    title={r.title || r.typeLabel}
                  >
                    {iconName && <Icon.Primary name={iconName} embedded />}
                  </span>
                );
              })}
            </div>
            {deployTextLinks.length > 0 && (
              <div className={styles.deployLinks}>
                {deployTextLinks.map((link, idx) => {
                  const r = resolveLink(link, docs);
                  if (!r) return null;
                  const label = resolveDeployLabel(link, r, t);
                  if (!label) return null;
                  const isDiscontinued = project.status === PROJECT_STATUS.SUPPORT_ENDED;
                  const deployTextCls = buildCls(styles.deployLinkText, isDiscontinued && styles.discontinued);
                  return r.href ? (
                    <a
                      key={`deploy-link-${idx}`}
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={a11y('project.deployLink', { label, title: r.title || label })}
                      title={r.title || label}
                    >
                      <span className={styles.deployLinkIconWrap} aria-hidden="true">
                        <span className={styles.deployLinkIcon}>
                          <Icon.Primary name="link" embedded />
                        </span>
                      </span>
                      {!(variant === 'card' && isMobile) && (
                        <span className={deployTextCls}>
                          {label}
                        </span>
                      )}
                      {isDiscontinued && <span className={styles.linkStatus}>{t('project.linkStatus')}</span>}
                    </a>
                  ) : (
                    <span
                      key={`deploy-link-${idx}`}
                      className={styles.deployLinkDisabled}
                      title={r.title || label}
                    >
                      <span className={styles.deployLinkIconWrap} aria-hidden="true">
                        <span className={styles.deployLinkIcon}>
                          <Icon.Primary name="link" embedded />
                        </span>
                      </span>
                      {!(variant === 'card' && isMobile) && (
                        <span className={deployTextCls}>
                          {label}
                        </span>
                      )}
                      {isDiscontinued && <span className={styles.linkStatus}>{t('project.linkStatus')}</span>}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.backMetaBlock}>
      <p className={styles.summary}>
        <TwoLineText
          text={project.summary || ''}
          renderLine={(line) =>
            descTerms.length
              ? highlightRichText(line, descTerms, styles.highlight, renderRichText)
              : renderRichText(line)
          }
        />
      </p>

      <div className={styles.tagsWrap}>
        <div className={styles.tagsScroll}>
          {tagsToShow.map((tag) => (
            <TagButton
              key={tag}
              name={tag}
              onClick={(e) => (e.stopPropagation(), appendShortcutToQuery(`#${tag}`))}
              ariaLabel={a11y('project.searchByTag', { tag })}
            />
          ))}
        </div>
      </div>

      <div className={styles.languageLine} ref={lineRef}>
        {stackChipsLine}
      </div>
      </div>
      </div>

      {variant === 'card' ? (
        <>
          <hr className={styles.backDivider} />
          <div className={styles.backSummaryOnly}>
          <ul className={styles.backSectionList}>
            {(project.sections as ProjectSection[] || []).map((section) => (
              <li key={section.title} className={styles.backSectionBlock}>
                <span className={styles.backSectionTitle}>
                  {descTerms.length ? highlightRichText(section.title ?? '', descTerms, styles.highlight, renderRichText) : renderRichText(section.title)}
                </span>
              </li>
            ))}
          </ul>
          </div>
        </>
      ) : (
        <>
          <hr className={styles.backDivider} />
          <div className={styles.modalBody}>
          <div className={styles.sections}>
          {(project.sections as ProjectSection[] || []).map((section) => (
            <article key={section.title} className={styles.section}>
              <h5>{descTerms.length ? highlightRichText(section.title ?? '', descTerms, styles.highlight, renderRichText) : renderRichText(section.title)}</h5>
              <ul>
                {(section.items || []).map((item: unknown, idx: number) =>
                  renderSectionItem(item, section, section.title ?? '', idx, descTerms, styles, docs, a11y)
                )}
              </ul>
              <div className={styles.sectionLinks}>
                {(section.links || []).map((link: ProjectLink, idx: number) => {
                  const r = resolveLink(link, docs);
                  if (!r) return null;
                  return (
                    <TypedExternalLink
                      key={`${section.title}-link-${idx}`}
                      href={r.href}
                      typeLabel={r.typeLabel}
                      title={renderLinkTitle(r.title, linkStyles.sep)}
                      ariaLabel={a11y('project.sectionDocLink', { type: r.typeLabel, title: r.title })}
                    />
                  );
                })}
              </div>
            </article>
          ))}
          </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProjectDetailContent;
