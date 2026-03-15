import { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cardStyles from './projectCard.module.css';
import { toHashTag } from './utils/tagUtil';
import { buildCls } from '../../utils/cssUtil';
import { Icon } from '@components/shared/icon/Icon';
import { normalizeType, getLinkTypeLabel, linkIconNameByType, deployLabelByType } from './utils/linkLabels';
import { renderRichText, renderLinkTitle } from './utils/richText';
import { useProjectSearchStore } from '../../stores/projectSearchStore';
import { parseQuery } from './search/parseQuery';
import { normalizeStackToken } from './search/stackMapping';
import { getHighlightTerms, getTagsToHighlight, getEffectiveTagsSorted, getEffectiveStacksSorted, highlightText, highlightStackText, highlightRichText } from './search/highlight';
import { useDocs } from '../../hooks/useDocs';
import { getDocById } from '../../utils/docs';

function resolveLink(link, docs) {
  if (!link?.type) return null;
  if (normalizeType(link.type) === 'doc') {
    const doc = getDocById(docs, link.id);
    if (!doc) return { href: null, title: link.id, typeLabel: 'Doc' };
    return { href: doc.link, title: doc.title, typeLabel: getLinkTypeLabel(doc.platform) };
  }
  return { href: link.href, title: link.title, typeLabel: getLinkTypeLabel(link.type) };
}

function renderSectionItem(item, sectionTitle, itemIndex, descTerms, cardStyles, docs) {
  const highlight = (text) =>
    descTerms?.length ? highlightRichText(text, descTerms, cardStyles.highlight, renderRichText) : renderRichText(text);

  if (typeof item === 'string') {
    return <li key={`${sectionTitle}-${itemIndex}`}>{highlight(item)}</li>;
  }
  const title = item?.title || '';
  const subItems = Array.isArray(item?.items) ? item.items : [];
  const subLinks = Array.isArray(item?.links) ? item.links : [];
  return (
    <li key={`${sectionTitle}-${itemIndex}`} className={cardStyles.nestedItem}>
      {title ? <div className={cardStyles.itemTitle}>{highlight(title)}</div> : null}
      {subItems.length > 0 ? (
        <ul className={cardStyles.subList}>
          {subItems.map((sub, subIndex) => (
            <li key={`${sectionTitle}-${itemIndex}-sub-${subIndex}`}>{typeof sub === 'string' ? highlight(sub) : renderRichText(sub)}</li>
          ))}
        </ul>
      ) : null}
      {subLinks.length > 0 ? (
        <div className={cardStyles.sectionLinks} onClick={(e) => e.stopPropagation()}>
          {subLinks.map((link, linkIndex) => {
            const r = resolveLink(link, docs);
            if (!r) return null;
            return r.href ? (
              <a key={`${sectionTitle}-${itemIndex}-link-${linkIndex}`} href={r.href} target="_blank" rel="noreferrer">
                <Icon name="link" />
                <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
              </a>
            ) : (
              <span key={`${sectionTitle}-${itemIndex}-link-${linkIndex}`} className={cardStyles.linkDisabled}>
                <Icon name="link" />
                <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
              </span>
            );
          })}
        </div>
      ) : null}
    </li>
  );
}

export function ProjectDetailContent({ project, variant, isMobile = false }) {
  const { t } = useTranslation();
  const docs = useDocs();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const parsedClauses = useMemo(
    () => (rawQuery ? parseQuery(String(rawQuery).trim(), normalizeStackToken) : []),
    [rawQuery]
  );
  const { titleTerms, descTerms, stackTerms } = useMemo(() => getHighlightTerms(parsedClauses), [parsedClauses]);
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
  const showLinkTypeChip = variant !== 'card';

  const tagsWrapRef = useRef(null);
  const [tagsOverflow, setTagsOverflow] = useState(false);
  const tagsList = effectiveTags.tags;
  useEffect(() => {
    const el = tagsWrapRef.current;
    if (!el || tagsList.length === 0) return;
    const scroll = el.firstElementChild;
    if (!scroll) return;
    const check = () => {
      const scroll = el.firstElementChild;
      if (!scroll) return;
      const contentW = scroll.scrollWidth;
      const visibleW = el.clientWidth;
      setTagsOverflow(contentW > visibleW);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tagsList.length, project.id]);

  return (
    <>
      <div className={buildCls(variant === 'popup' && cardStyles.popupHead, variant !== 'popup' && cardStyles.backHeadWrap)}>
      <div className={cardStyles.backHead}>
        <div className={cardStyles.backHeadTop}>
          <h4 className={cardStyles.projectType}>{project.typeLabel}</h4>
          <div className={cardStyles.backHeadRight}>
            <div className={cardStyles.period}>{project.periodLabel}</div>
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
                    aria-label={r.title || r.typeLabel}
                    title={r.title || r.typeLabel}
                  >
                    {linkIconNameByType(link.type) ? <Icon name={linkIconNameByType(link.type)} /> : null}
                  </a>
                ) : (
                  <span
                    key={`title-link-${idx}`}
                    className={cardStyles.titleLinkDisabled}
                    aria-label={r.title || r.typeLabel}
                    title={r.title || r.typeLabel}
                  >
                    {linkIconNameByType(link.type) ? <Icon name={linkIconNameByType(link.type)} /> : null}
                  </span>
                );
              })}
            </div>
            {deployTextLinks.length > 0 ? (
              <div className={cardStyles.deployLinks}>
                {deployTextLinks.map((link, idx) => {
                  const r = resolveLink(link, docs);
                  if (!r) return null;
                  const typeKey = normalizeType(link.type);
                  const label = typeKey === 'notion' ? r.title : (t(`project.deploy.${typeKey}`, { defaultValue: deployLabelByType(link.type) }) || '');
                  if (!label) return null;
                  const isDiscontinued = typeKey === 'appstore';
                  return r.href ? (
                    <a
                      key={`deploy-link-${idx}`}
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={r.title || label}
                      title={r.title || label}
                    >
                      <Icon name="link" className={cardStyles.deployLinkIcon} />
                      {!(variant === 'card' && isMobile) && (
                        <span className={buildCls(cardStyles.deployLinkText, isDiscontinued && cardStyles.discontinued)}>
                          {label}
                        </span>
                      )}
                      {isDiscontinued ? <span className={cardStyles.linkStatus}>{t('project.linkStatus')}</span> : null}
                    </a>
                  ) : (
                    <span
                      key={`deploy-link-${idx}`}
                      className={cardStyles.deployLinkDisabled}
                      title={r.title || label}
                    >
                      <Icon name="link" className={cardStyles.deployLinkIcon} />
                      {!(variant === 'card' && isMobile) && (
                        <span className={buildCls(cardStyles.deployLinkText, isDiscontinued && cardStyles.discontinued)}>
                          {label}
                        </span>
                      )}
                      {isDiscontinued ? <span className={cardStyles.linkStatus}>{t('project.linkStatus')}</span> : null}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cardStyles.backMetaBlock}>
      <p className={cardStyles.summary}>
        {descTerms.length
          ? highlightRichText(project.summary || '', descTerms, cardStyles.highlight, renderRichText)
          : renderRichText(project.summary || '')}
      </p>

      <div
        ref={tagsWrapRef}
        className={buildCls(cardStyles.tagsWrap, tagsOverflow && cardStyles.tagsOverflow)}
        aria-hidden={tagsOverflow}
      >
        <div className={cardStyles.tagsScroll}>
          {effectiveTags.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cardStyles.tagButton}
              onClick={(e) => {
                e.stopPropagation();
                setQueryFromShortcut(`#${tag}`);
              }}
              aria-label={`태그 ${tag}로 검색`}
            >
              {effectiveTags.tagsToHighlight.includes(tag) ? (
                <mark className={cardStyles.highlight}>{toHashTag(tag)}</mark>
              ) : (
                toHashTag(tag)
              )}
            </button>
          ))}
          {tagsOverflow && effectiveTags.tags.map((tag) => (
            <button
              key={`dup-${tag}`}
              type="button"
              className={cardStyles.tagButton}
              onClick={(e) => {
                e.stopPropagation();
                setQueryFromShortcut(`#${tag}`);
              }}
              aria-label={`태그 ${tag}로 검색`}
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

      <div className={cardStyles.languageLine}>
        <span className={cardStyles.languageStacks}>
          {effectiveStacks.stacks.length > 0
            ? effectiveStacks.stacks.map((stack, i) => (
                <span key={stack}>
                  {i > 0 ? ' / ' : null}
                  <button
                    type="button"
                    className={cardStyles.stackTextButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQueryFromShortcut(`stack:${stack}`);
                    }}
                    aria-label={`기술스택 ${stack}로 검색`}
                  >
                    {stackTerms.length
                      ? highlightStackText(stack, stackTerms, cardStyles.highlight, normalizeStackToken)
                      : stack}
                  </button>
                </span>
              ))
            : '-'}
        </span>
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
                {(section.links || []).length > 0 ? (
                  <div className={cardStyles.sectionLinks} onClick={stopIfCard}>
                    {(section.links || []).map((link, idx) => {
                      const r = resolveLink(link, docs);
                      if (!r) return null;
                      return r.href ? (
                        <a
                          key={`${section.title}-link-${idx}`}
                          href={r.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon name="link" />
                          {showLinkTypeChip ? <strong className={cardStyles.linkType}>{r.typeLabel}</strong> : null}
                          <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
                        </a>
                      ) : (
                        <span key={`${section.title}-link-${idx}`} className={cardStyles.linkDisabled}>
                          <Icon name="link" />
                          {showLinkTypeChip ? <strong className={cardStyles.linkType}>{r.typeLabel}</strong> : null}
                          <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
                        </span>
                      );
                    })}
                  </div>
                ) : null}
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
                {(section.items || []).map((item, idx) => renderSectionItem(item, section.title, idx, descTerms, cardStyles, docs))}
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
                    >
                      <Icon name="link" />
                      <strong className={cardStyles.linkType}>{r.typeLabel}</strong>
                      <span className={cardStyles.linkTitle}>{renderLinkTitle(r.title, cardStyles.linkSep)}</span>
                    </a>
                  ) : (
                    <span key={`${section.title}-link-${idx}`} className={cardStyles.linkDisabled}>
                      <Icon name="link" />
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
