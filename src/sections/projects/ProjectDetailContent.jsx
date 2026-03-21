import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../../hooks/useA11y';
import cardStyles from './projectCard.module.css';
import { toHashTag } from './utils/tagUtil';
import { buildCls } from '../../utils/cssUtil';
import { Icon } from '@components/shared/icon/Icon';
import { normalizeType, getLinkTypeLabel, linkIconNameByType, deployLabelByType } from './utils/linkLabels';
import { renderRichText, renderLinkTitle } from './utils/richText';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { parseQuery } from './search/parseQuery';
import { normalizeStackToken, getStackIconName } from './search/stackMapping';
import { getHighlightTerms, getEffectiveTagsSorted, getEffectiveStacksSorted, highlightText, highlightRichText } from './search/highlight';
import { useDocs } from '../../hooks/useDocs';
import { getDocById } from '../../utils/docs';
import { renderTextWithBreakAtSpaces } from '../../utils/textWrap';
import { isStackMatchedByQuery } from './search/filterProjects';
import { useResponsive } from '../../hooks/useResponsive';
import { useConfigStore } from '../../stores/configStore';
import config from '../../config.js';
import { getMaxVisibleChips } from '../../utils/getMaxVisibleChips.js';
import { useStackChipsOverflow } from './useStackChipsOverflow';
import { StatusChip } from './StatusChip';
import { PROJECT_STATUS } from './status/projectStatus';

function resolveLink(link, docs) {
  if (!link?.type) return null;
  if (normalizeType(link.type) === 'doc') {
    const doc = getDocById(docs, link.id);
    if (!doc) return { href: null, title: link.id, typeLabel: 'Doc' };
    return { href: doc.link, title: doc.title, typeLabel: getLinkTypeLabel(doc.platform) };
  }
  return { href: link.href, title: link.title, typeLabel: getLinkTypeLabel(link.type) };
}

function renderSectionItem(item, section, sectionTitle, itemIndex, descTerms, cardStyles, docs, a11y, setQueryFromShortcut) {
  const highlight = (text) =>
    descTerms?.length ? highlightRichText(text, descTerms, cardStyles.highlight, renderRichText) : renderRichText(text);
  const searchChip = section?.searchChip;
  const showSearchChip = searchChip && itemIndex === 0 && typeof item === 'string';

  if (typeof item === 'string') {
    const handleChipClick = () => {
      if (searchChip?.searchQuery) setQueryFromShortcut(searchChip.searchQuery);
      const el = document.getElementById('project');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const handleSearchChipClick = (e) => {
      e.stopPropagation();
      handleChipClick();
    };
    return (
      <li key={`${sectionTitle}-${itemIndex}`}>
        {showSearchChip && (
          <>
            <button
              type="button"
              className={cardStyles.sectionSearchChip}
              onClick={handleSearchChipClick}
              aria-label={a11y('docs.chipNavigate', { chip: searchChip.label })}
            >
              <span className={cardStyles.sectionSearchChipIcon} aria-hidden="true">
                <Icon name="search" />
              </span>
              {searchChip.label}
            </button>
            {' '}
          </>
        )}
        {highlight(item)}
      </li>
    );
  }
  const title = item?.title || '';
  const subItems = Array.isArray(item?.items) ? item.items : [];
  const subLinks = Array.isArray(item?.links) ? item.links : [];
  return (
    <li key={`${sectionTitle}-${itemIndex}`} className={cardStyles.nestedItem}>
      {title && <div className={cardStyles.itemTitle}>{highlight(title)}</div>}
      {subItems.length > 0 && (
        <ul className={cardStyles.subList}>
          {subItems.map((sub, subIndex) => (
            <li key={`${sectionTitle}-${itemIndex}-sub-${subIndex}`}>{typeof sub === 'string' ? highlight(sub) : renderRichText(sub)}</li>
          ))}
        </ul>
      )}
      {subLinks.length > 0 && (
        <div className={cardStyles.sectionLinks} onClick={(e) => e.stopPropagation()}>
          {subLinks.map((link, linkIndex) => {
            const r = resolveLink(link, docs);
            if (!r) return null;
            return r.href ? (
              <a
                key={`${sectionTitle}-${itemIndex}-link-${linkIndex}`}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                aria-label={a11y('project.sectionDocLink', { type: r.typeLabel, title: r.title })}
              >
                <Icon name="link" aria-hidden />
                <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
              </a>
            ) : (
              <span key={`${sectionTitle}-${itemIndex}-link-${linkIndex}`} className={cardStyles.linkDisabled}>
                <Icon name="link" aria-hidden />
                <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
              </span>
            );
          })}
        </div>
      )}
    </li>
  );
}

export function ProjectDetailContent({ project, variant, isMobile = false }) {
  const { t } = useTranslation();
  const a11y = useA11y();
  const docs = useDocs();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const appendShortcutToQuery = useProjectSearchStore((s) => s.appendShortcutToQuery);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
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
    () => (project.links || project.relatedLinks || []).filter((link) => link?.type),
    [project.links, project.relatedLinks]
  );
  const titleIconLinks = useMemo(
    () => projectLinks.filter((link) => normalizeType(link.type) === 'github'),
    [projectLinks]
  );
  const deployTextLinks = useMemo(
    () =>
      projectLinks.filter((link) =>
        ['appstore', 'deploy', 'pubdev', 'npm', 'notion'].includes(normalizeType(link.type))
      ),
    [projectLinks]
  );
  const stopIfCard = variant === 'card' ? (e) => e.stopPropagation() : undefined;

  const { type: breakpointType } = useResponsive();
  const typographyScale = useConfigStore((s) => s.typographyScale) ?? config.typography.scale;
  const { maxTags: maxVisibleTags, maxStacks: maxVisibleStacks } = getMaxVisibleChips(breakpointType, typographyScale);
  const tagsToShow = variant === 'card' ? effectiveTags.tags.slice(0, maxVisibleTags) : effectiveTags.tags;
  const stacksToShow = variant === 'card' ? effectiveStacks.stacks.slice(0, maxVisibleStacks) : effectiveStacks.stacks;
  const { useEvenSplit, lineRef, chipsContainerRef } = useStackChipsOverflow(stacksToShow.length);

  return (
    <>
      <div className={buildCls(variant === 'popup' && cardStyles.popupHead, variant !== 'popup' && cardStyles.backHeadWrap)}>
      <div className={cardStyles.backHead}>
        <div className={cardStyles.backHeadTop}>
          <h4 className={cardStyles.projectType}>{project.typeLabel}</h4>
          <div className={cardStyles.backHeadRight}>
            <div className={buildCls(cardStyles.periodRow, variant === 'popup' && cardStyles.periodRowPopup)}>
              <div className={cardStyles.period}>{project.periodLabel}</div>
              {variant === 'popup' && <StatusChip status={project.status} variant="popup" />}
            </div>
            <div className={cardStyles.teamIcons} aria-hidden="true">
              {Array.from({ length: project.teamSize }).map((_, i) => (
                <Icon key={i} name="person" />
              ))}
            </div>
          </div>
        </div>
        <div className={cardStyles.backTitleRow}>
          <h3 title={project.title}>
            {titleTerms.length ? highlightText(project.title || '', titleTerms, cardStyles.highlight) : (project.title || '')}
          </h3>
          <div className={cardStyles.titleLinksRow} onClick={stopIfCard}>
            <div className={cardStyles.titleLinks}>
              {titleIconLinks.map((link, idx) => {
                const r = resolveLink(link, docs);
                if (!r) return null;
                return r.href ? (
                  <a
                    key={`title-link-${idx}`}
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={a11y('project.titleLink', { title: r.title || r.typeLabel })}
                    title={r.title || r.typeLabel}
                  >
                    {linkIconNameByType(link.type) ? <Icon name={linkIconNameByType(link.type)} aria-hidden /> : null}
                  </a>
                ) : (
                  <span
                    key={`title-link-${idx}`}
                    className={cardStyles.titleLinkDisabled}
                    aria-label={a11y('project.titleLink', { title: r.title || r.typeLabel })}
                    title={r.title || r.typeLabel}
                  >
                    {linkIconNameByType(link.type) && <Icon name={linkIconNameByType(link.type)} aria-hidden />}
                  </span>
                );
              })}
            </div>
            {deployTextLinks.length > 0 && (
              <div className={cardStyles.deployLinks}>
                {deployTextLinks.map((link, idx) => {
                  const r = resolveLink(link, docs);
                  if (!r) return null;
                  const typeKey = normalizeType(link.type);
                  const label = typeKey === 'notion' ? r.title : (t(`project.deploy.${typeKey}`, { defaultValue: deployLabelByType(link.type) }) || '');
                  if (!label) return null;
                  const isDiscontinued = project.status === PROJECT_STATUS.SUPPORT_ENDED;
                  return r.href ? (
                    <a
                      key={`deploy-link-${idx}`}
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={a11y('project.deployLink', { label, title: r.title || label })}
                      title={r.title || label}
                    >
                      <span className={cardStyles.deployLinkIconWrap} aria-hidden="true">
                        <Icon name="link" className={cardStyles.deployLinkIcon} aria-hidden />
                      </span>
                      {!(variant === 'card' && isMobile) && (
                        <span className={buildCls(cardStyles.deployLinkText, isDiscontinued && cardStyles.discontinued)}>
                          {label}
                        </span>
                      )}
                      {isDiscontinued && <span className={cardStyles.linkStatus}>{t('project.linkStatus')}</span>}
                    </a>
                  ) : (
                    <span
                      key={`deploy-link-${idx}`}
                      className={cardStyles.deployLinkDisabled}
                      title={r.title || label}
                    >
                      <span className={cardStyles.deployLinkIconWrap} aria-hidden="true">
                        <Icon name="link" className={cardStyles.deployLinkIcon} />
                      </span>
                      {!(variant === 'card' && isMobile) && (
                        <span className={buildCls(cardStyles.deployLinkText, isDiscontinued && cardStyles.discontinued)}>
                          {label}
                        </span>
                      )}
                      {isDiscontinued && <span className={cardStyles.linkStatus}>{t('project.linkStatus')}</span>}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cardStyles.backMetaBlock}>
      <p className={cardStyles.summary}>
        {renderTextWithBreakAtSpaces(
          project.summary || '',
          cardStyles.summaryWord,
          (segment) =>
            descTerms.length
              ? highlightRichText(segment, descTerms, cardStyles.highlight, renderRichText)
              : renderRichText(segment)
        )}
      </p>

      <div className={cardStyles.tagsWrap}>
        <div className={cardStyles.tagsScroll}>
          {tagsToShow.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cardStyles.tagButton}
              onClick={(e) => (e.stopPropagation(), appendShortcutToQuery(`#${tag}`))}
              aria-label={a11y('project.searchByTag', { tag })}
            >
              {effectiveTags.tagsToHighlight.includes(tag) ? (
                <mark className={cardStyles.highlight}>{toHashTag(tag)}</mark>
              ) : (
                toHashTag(tag)
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={cardStyles.languageLine} ref={lineRef}>
        {(() => {
          const visible = stacksToShow;
          const twoRows = useEvenSplit && visible.length >= 2;
          const row1 = twoRows ? visible.slice(0, Math.floor(visible.length / 2)) : visible;
          const row2 = twoRows ? visible.slice(Math.floor(visible.length / 2)) : [];
          const renderChip = (stack) => (
            <button
              key={stack}
              type="button"
              className={buildCls(cardStyles.stackChip, isStackMatchedByQuery(stack, parsedClauses, normalizeStackToken) && cardStyles.stackChipHighlighted)}
              onClick={(e) => (e.stopPropagation(), appendShortcutToQuery(`stack:"${stack}"`))}
              aria-label={a11y('project.searchByStack', { stack })}
            >
              {getStackIconName(stack) && (
                <Icon name={getStackIconName(stack)} className={cardStyles.stackChipIcon} aria-hidden />
              )}
              <span className={cardStyles.stackChipText}>{stack}</span>
            </button>
          );
          if (visible.length === 0) return <span className={cardStyles.languageStacks}>-</span>;
          if (twoRows) {
            return (
              <span className={cardStyles.languageStacksTwoRows}>
                <span className={cardStyles.languageStacksRow}>{row1.map(renderChip)}</span>
                <span className={cardStyles.languageStacksRow}>{row2.map(renderChip)}</span>
              </span>
            );
          }
          return (
            <span ref={chipsContainerRef} className={cardStyles.languageStacks}>
              {row1.map(renderChip)}
            </span>
          );
        })()}
      </div>
      </div>
      </div>

      {variant === 'card' ? (
        <>
          <hr className={cardStyles.backDivider} />
          <div className={cardStyles.backSummaryOnly}>
          <ul className={cardStyles.backSectionList}>
            {(project.sections || []).map((section) => (
              <li key={section.title} className={cardStyles.backSectionBlock}>
                <span className={cardStyles.backSectionTitle}>
                  {descTerms.length ? highlightRichText(section.title, descTerms, cardStyles.highlight, renderRichText) : renderRichText(section.title)}
                </span>
              </li>
            ))}
          </ul>
          </div>
        </>
      ) : (
        <>
          <hr className={cardStyles.backDivider} />
          <div className={cardStyles.popupBody}>
          <div className={cardStyles.sections}>
          {(project.sections || []).map((section) => (
            <article key={section.title} className={cardStyles.section}>
              <h5>{descTerms.length ? highlightRichText(section.title, descTerms, cardStyles.highlight, renderRichText) : renderRichText(section.title)}</h5>
              <ul>
                {(section.items || []).map((item, idx) =>
                  renderSectionItem(item, section, section.title, idx, descTerms, cardStyles, docs, a11y, setQueryFromShortcut)
                )}
              </ul>
              <div className={cardStyles.sectionLinks}>
                {(section.links || []).map((link, idx) => {
                  const r = resolveLink(link, docs);
                  if (!r) return null;
                  return r.href ? (
                    <a
                      key={`${section.title}-link-${idx}`}
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={a11y('project.sectionDocLink', { type: r.typeLabel, title: r.title })}
                    >
                      <Icon name="link" aria-hidden />
                      <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                      <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
                    </a>
                  ) : (
                    <span key={`${section.title}-link-${idx}`} className={cardStyles.linkDisabled}>
                      <Icon name="link" aria-hidden />
                      <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                      <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
                    </span>
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
