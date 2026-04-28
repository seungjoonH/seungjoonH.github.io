import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '../../../hooks/useA11y';
import cardStyles from './projectCard.module.css';
import { toHashTag } from './utils/tagUtil';
import { buildCls } from '../../../utils/cssUtil';
import { Icon } from '@components/shared/icon/Icon';
import { normalizeType, getLinkTypeLabel, linkIconNameByType, deployLabelByType } from './utils/linkLabels';
import { renderRichText, renderLinkTitle } from './utils/richText';
import { useProjectSearchStore } from '../../../stores/projectSearchStore';
import { parseQuery } from './search/parseQuery';
import { normalizeStackToken, getStackIconName } from './search/stackMapping';
import { getHighlightTerms, getEffectiveTagsSorted, getEffectiveStacksSorted, highlightText, highlightRichText } from './search/highlight';
import { useDocs } from '../../../hooks/useDocs';
import { getDocById } from '../../../utils/docs';
import { renderTextWithBreakAtSpaces } from '../../../utils/textWrap';
import { isStackMatchedByQuery } from './search/filterProjects';
import { useResponsive } from '../../../hooks/useResponsive';
import { useConfigStore } from '../../../stores/configStore';
import config from '../../../config.js';
import { getMaxVisibleChips } from '../../../utils/getMaxVisibleChips.js';
import { useStackChipsOverflow } from './useStackChipsOverflow';
import { StatusChip } from './StatusChip';
import { PROJECT_STATUS } from './status/projectStatus';
import { useVersionHash } from '../../../versioning/VersionContext.jsx';
import { trackEvent } from '../../../utils/analytics.js';

const LINK_SURFACE_BY_TYPE = Object.freeze({
  github: 'titleIcon',
  appstore: 'deployText',
  deploy: 'deployText',
  pubdev: 'deployText',
  npm: 'deployText',
  notion: 'deployText',
});

const DEPLOY_LABEL_RESOLVER_BY_TYPE = Object.freeze({
  appstore: ({ t, linkType }) => t('project.deploy.appstore', { defaultValue: deployLabelByType(linkType) }) || '',
  deploy: ({ t, linkType }) => t('project.deploy.deploy', { defaultValue: deployLabelByType(linkType) }) || '',
  pubdev: ({ t, linkType }) => t('project.deploy.pubdev', { defaultValue: deployLabelByType(linkType) }) || '',
  npm: ({ t, linkType }) => t('project.deploy.npm', { defaultValue: deployLabelByType(linkType) }) || '',
  notion: ({ resolved }) => resolved.title || '',
});

function getLinkSurface(type) {
  return LINK_SURFACE_BY_TYPE[normalizeType(type)] ?? null;
}

function resolveDeployLabel(link, resolved, t) {
  const typeKey = normalizeType(link.type);
  const resolveLabel = DEPLOY_LABEL_RESOLVER_BY_TYPE[typeKey];
  if (!resolveLabel) return '';
  return resolveLabel({ t, linkType: link.type, resolved });
}

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
    () => projectLinks.filter((link) => getLinkSurface(link.type) === 'titleIcon'),
    [projectLinks]
  );
  const deployTextLinks = useMemo(
    () => projectLinks.filter((link) => getLinkSurface(link.type) === 'deployText'),
    [projectLinks]
  );
  const stopIfCard = variant === 'card' ? (e) => e.stopPropagation() : undefined;

  const { type: breakpointType } = useResponsive();
  const versionHash = useVersionHash();
  const language = useConfigStore((s) => s.language);
  const typographyScale = useConfigStore((s) => s.typographyScale) ?? config.typography.scale;
  const { maxTags: maxVisibleTags, maxStacks: maxVisibleStacks } = getMaxVisibleChips(breakpointType, typographyScale);
  const tagsToShow = variant === 'card' ? effectiveTags.tags.slice(0, maxVisibleTags) : effectiveTags.tags;
  const stacksToShow = variant === 'card' ? effectiveStacks.stacks.slice(0, maxVisibleStacks) : effectiveStacks.stacks;
  const { useEvenSplit, lineRef, chipsContainerRef } = useStackChipsOverflow(stacksToShow.length);

  const headWrapCls = buildCls(variant === 'popup' && cardStyles.popupHead, variant !== 'popup' && cardStyles.backHeadWrap);
  const periodRowCls = buildCls(cardStyles.periodRow, variant === 'popup' && cardStyles.periodRowPopup);

  const stacksForLine = stacksToShow;
  const stackTwoRows = useEvenSplit && stacksForLine.length >= 2;
  const stackRow1 = stackTwoRows ? stacksForLine.slice(0, Math.floor(stacksForLine.length / 2)) : stacksForLine;
  const stackRow2 = stackTwoRows ? stacksForLine.slice(Math.floor(stacksForLine.length / 2)) : [];

  const renderDetailStackChip = (stack) => {
    const chipCls = buildCls(
      cardStyles.stackChip,
      isStackMatchedByQuery(stack, parsedClauses, normalizeStackToken) && cardStyles.stackChipHighlighted
    );
    return (
      <button
        key={stack}
        type="button"
        className={chipCls}
        onClick={(e) => {
          e.stopPropagation();
          trackEvent({
            event: 'skill:click',
            versionHash,
            locale: language,
            entityId: stack,
            dedupeKey: `skill:click:${stack}`,
          });
          appendShortcutToQuery(`stack:"${stack}"`);
        }}
        aria-label={a11y('project.searchByStack', { stack })}
      >
        {getStackIconName(stack) && (
          <span className={cardStyles.stackChipIcon} aria-hidden="true">
            <Icon name={getStackIconName(stack)} />
          </span>
        )}
        <span className={cardStyles.stackChipText}>{stack}</span>
      </button>
    );
  };

  let stackChipsLine;
  if (stacksForLine.length === 0) {
    stackChipsLine = <span className={cardStyles.languageStacks}>-</span>;
  } else if (stackTwoRows) {
    stackChipsLine = (
      <span className={cardStyles.languageStacksTwoRows}>
        <span className={cardStyles.languageStacksRow}>{stackRow1.map(renderDetailStackChip)}</span>
        <span className={cardStyles.languageStacksRow}>{stackRow2.map(renderDetailStackChip)}</span>
      </span>
    );
  } else {
    stackChipsLine = (
      <span ref={chipsContainerRef} className={cardStyles.languageStacks}>
        {stackRow1.map(renderDetailStackChip)}
      </span>
    );
  }

  return (
    <>
      <div className={headWrapCls}>
      <div className={cardStyles.backHead}>
        <div className={cardStyles.backHeadTop}>
          <h4 className={cardStyles.projectType}>{project.typeLabel}</h4>
          <div className={cardStyles.backHeadRight}>
            <div className={periodRowCls}>
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
                  const label = resolveDeployLabel(link, r, t);
                  if (!label) return null;
                  const isDiscontinued = project.status === PROJECT_STATUS.SUPPORT_ENDED;
                  const deployTextCls = buildCls(cardStyles.deployLinkText, isDiscontinued && cardStyles.discontinued);
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
                        <span className={cardStyles.deployLinkIcon}>
                          <Icon name="link" />
                        </span>
                      </span>
                      {!(variant === 'card' && isMobile) && (
                        <span className={deployTextCls}>
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
                        <span className={cardStyles.deployLinkIcon}>
                          <Icon name="link" />
                        </span>
                      </span>
                      {!(variant === 'card' && isMobile) && (
                        <span className={deployTextCls}>
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
        {stackChipsLine}
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
