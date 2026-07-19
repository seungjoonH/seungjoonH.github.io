// 프로젝트 상세 섹션 아이템·링크 resolve/render 헬퍼
import type { MouseEvent } from 'react';
import { SearchShortcutChipButton } from '@components/feature/chip/SearchShortcutChipButton';
import { TypedExternalLink } from '@components/composed/link/TypedExternalLink';
import { normalizeType, getLinkTypeLabel, deployLabelByType } from './utils/linkLabels';
import { renderRichText, renderLinkTitle } from './utils/richText';
import { getDocById, type DocsCollection } from '@sections/docs/getDocById';
import { highlightRichText } from './search/highlight';
import { parseArray } from '@utils/parse';
import { typedExternalLinkStyles as linkStyles } from '@components/composed/link/TypedExternalLink';

const LINK_SURFACE_BY_TYPE = Object.freeze({
  github: 'titleIcon',
  appstore: 'deployText',
  deploy: 'deployText',
  pubdev: 'deployText',
  npm: 'deployText',
  notion: 'deployText',
});

const DEPLOY_LABEL_RESOLVER_BY_TYPE: Record<string, (args: {
  t?: (key: string, options?: Record<string, unknown>) => string;
  linkType?: string;
  resolved?: ResolvedLink;
}) => string> = Object.freeze({
  appstore: ({ t, linkType }) => t!('project.deploy.appstore', { defaultValue: deployLabelByType(linkType) }) || '',
  deploy: ({ t, linkType }) => t!('project.deploy.deploy', { defaultValue: deployLabelByType(linkType) }) || '',
  pubdev: ({ t, linkType }) => t!('project.deploy.pubdev', { defaultValue: deployLabelByType(linkType) }) || '',
  npm: ({ t, linkType }) => t!('project.deploy.npm', { defaultValue: deployLabelByType(linkType) }) || '',
  notion: ({ resolved }) => resolved?.title || '',
});

export function getLinkSurface(type?: string): string | null {
  return LINK_SURFACE_BY_TYPE[normalizeType(type) as keyof typeof LINK_SURFACE_BY_TYPE] ?? null;
}

export interface ResolvedLink {
  href: string | null;
  title: string | undefined;
  typeLabel: string;
}

export interface ProjectLink {
  type?: string;
  title?: string;
  href?: string;
  id?: string;
}

export function resolveDeployLabel(
  link: ProjectLink,
  resolved: ResolvedLink,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const typeKey = normalizeType(link.type);
  const resolveLabel = DEPLOY_LABEL_RESOLVER_BY_TYPE[typeKey as keyof typeof DEPLOY_LABEL_RESOLVER_BY_TYPE];
  if (!resolveLabel) return '';
  return resolveLabel({ t, linkType: link.type, resolved });
}

export function resolveLink(link: ProjectLink, docs: DocsCollection): ResolvedLink | null {
  if (!link?.type) return null;
  if (normalizeType(link.type) === 'doc') {
    const doc = getDocById(docs, link.id ?? '');
    if (!doc) return { href: null, title: link.id ?? '', typeLabel: 'Doc' };
    return { href: doc.link ?? null, title: doc.title, typeLabel: getLinkTypeLabel(doc.platform) };
  }
  return { href: link.href ?? null, title: link.title, typeLabel: getLinkTypeLabel(link.type) };
}

export interface ProjectSection {
  title?: string;
  items?: unknown[];
  links?: ProjectLink[];
  searchChip?: { label?: string; searchQuery?: string };
}

export function renderSectionItem(
  item: unknown,
  section: ProjectSection,
  sectionTitle: string,
  itemIndex: number,
  descTerms: string[],
  styles: Record<string, string>,
  docs: DocsCollection,
  a11y: (key: string, options?: Record<string, unknown>) => string,
) {
  const highlight = (text: string) =>
    descTerms?.length ? highlightRichText(text, descTerms, styles.highlight, renderRichText) : renderRichText(text);
  const searchChip = section?.searchChip;
  const showSearchChip = searchChip && itemIndex === 0 && typeof item === 'string';

  if (typeof item === 'string') {
    const handleSearchChipClick = (e: MouseEvent) => {
      e.stopPropagation();
    };
    return (
      <li key={`${sectionTitle}-${itemIndex}`}>
        {showSearchChip && searchChip?.label && searchChip?.searchQuery && (
          <>
            <SearchShortcutChipButton
              label={searchChip.label}
              query={searchChip.searchQuery}
              onClick={handleSearchChipClick}
            />{' '}
          </>
        )}
        {highlight(item)}
      </li>
    );
  }
  
  const nested = item as { title?: string; items?: unknown[]; links?: ProjectLink[] };
  const title = nested?.title || '';
  const subItems = parseArray(nested?.items);
  const subLinks = parseArray<ProjectLink>(nested?.links);
  return (
    <li key={`${sectionTitle}-${itemIndex}`} className={styles.nestedItem}>
      {title && <div className={styles.itemTitle}>{highlight(title)}</div>}
      {subItems.length > 0 && (
        <ul className={styles.subList}>
          {subItems.map((sub: unknown, subIndex: number) => (
            <li key={`${sectionTitle}-${itemIndex}-sub-${subIndex}`}>{typeof sub === 'string' ? highlight(sub) : renderRichText(sub)}</li>
          ))}
        </ul>
      )}
      {subLinks.length > 0 && (
        <div className={styles.sectionLinks} onClick={(e: MouseEvent) => e.stopPropagation()}>
          {subLinks.map((link: ProjectLink, linkIndex: number) => {
            const r = resolveLink(link, docs);
            if (!r) return null;
            return (
              <TypedExternalLink
                key={`${sectionTitle}-${itemIndex}-link-${linkIndex}`}
                href={r.href}
                typeLabel={r.typeLabel}
                title={renderLinkTitle(r.title, linkStyles.sep)}
                ariaLabel={a11y('project.sectionDocLink', { type: r.typeLabel, title: r.title })}
              />
            );
          })}
        </div>
      )}
    </li>
  );
}

