// Docs 폴더 트리와 소스 칩 네비게이션
import { useState, useMemo, useEffect, type ReactNode, type MouseEvent } from 'react';
import { Heading } from '@components/design/heading/Heading';
import { Icon } from '@components/design/icon/Icon';
import { DocRow } from '@components/feature/row/DocRow';
import { useDocs } from './docs/useDocs';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { useDocsFocusStore, useExperienceFocusStore } from '@stores/focusIdStore';
import styles from './docs.module.css';
import { buildCls } from '@utils/cssUtil';
import { useA11y } from '@hooks/useA11y';
import { useAnalytics } from '@hooks/useAnalytics';
import { useDocsScrollFade } from './docs/useDocsScrollFade';
import { parseArray } from '@utils/parse';
import {
  DOC_CATEGORIES,
  type DocCategoryKey,
  type DocItem,
  type ExpandedFolders,
  expandOnly,
  findCategoryForDoc,
  hasAnyDocs,
  navigateFromDocSource,
  scrollToId,
} from './docs/docsNav';

const DIR_ICON_BY_OPEN = {
  true: 'dir-open',
  false: 'dir-close',
} as const;

export function Docs(): ReactNode {
  const a11y = useA11y();
  const docs = useDocs();
  const docIdToFocus = useDocsFocusStore((s) => s.idToFocus);
  const clearDocIdFocus = useDocsFocusStore((s) => s.clearIdToFocus);
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const setExperienceIdToFocus = useExperienceFocusStore((s) => s.setIdToFocus);
  const { trackDocClick } = useAnalytics();
  const { sectionRef, headerRef, contentRef } = useDocsScrollFade();
  const [expanded, setExpanded] = useState<ExpandedFolders>({
    portfolio: true,
    notion: true,
    githubWiki: false,
    tistory: false,
  });

  const categories = useMemo(
    () =>
      (Object.keys(DOC_CATEGORIES) as DocCategoryKey[])
        .map((key) => ({
          key,
          label: DOC_CATEGORIES[key].label,
          platformIcon: DOC_CATEGORIES[key].icon,
          items: parseArray<DocItem>(docs[key]),
        }))
        .filter((cat) => cat.items.length > 0),
    [docs],
  );

  useEffect(() => {
    if (!docIdToFocus) return;

    const category = findCategoryForDoc(docs, docIdToFocus);
    if (!category) {
      if (hasAnyDocs(docs)) clearDocIdFocus();
      return;
    }

    const rowId = docIdToFocus;
    setExpanded(expandOnly(category));
    clearDocIdFocus();
    requestAnimationFrame(() => scrollToId(`doc-row-${rowId}`, 'nearest'));
  }, [docIdToFocus, docs, clearDocIdFocus]);

  const handleChipClick = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    doc: DocItem
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!doc.source) return;
    navigateFromDocSource(doc.source, { setExperienceIdToFocus, setQueryFromShortcut });
  };

  return (
    <div className={styles.docsContainer} ref={sectionRef}>
      <div className={styles.docsHeaderBlock} ref={headerRef}>
        <div className={styles.docsHeaderWrap}>
          <div className={styles.docsTitle}>
            <Heading text="Docs" align="center" />
          </div>
        </div>
      </div>

      <nav ref={contentRef} className={styles.docsNav} aria-label={a11y('docs.nav')}>
        {categories.map(({ key, label, platformIcon, items }) => {
          const isOpen = expanded[key];
          const docListCls = buildCls(styles.docListWrap, isOpen && styles.docListWrapOpen);
          return (
            <div key={key} className={styles.folderBlock}>
              <button
                type="button"
                className={styles.folderRow}
                onClick={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
                aria-expanded={isOpen}
                aria-controls={`docs-list-${key}`}
              >
                <span className={styles.chevron} aria-hidden="true">
                  <Icon.Primary name={isOpen ? 'caret-down' : 'caret-right'} embedded />
                </span>
                <span className={styles.folderIcon} aria-hidden="true">
                  <Icon.Primary name={DIR_ICON_BY_OPEN[isOpen ? 'true' : 'false']} embedded />
                </span>
                <span className={styles.platformIcon} aria-hidden="true">
                  <Icon.Primary name={platformIcon} embedded />
                </span>
                <span className={styles.folderLabel}>{label}</span>
              </button>
              <section
                id={`docs-list-${key}`}
                className={docListCls}
                aria-label={a11y('docs.folderRegion', { label })}
              >
                <div className={styles.docListTrack}>
                  {items.map((doc) => (
                    <DocRow key={doc.id} doc={doc} onChipClick={handleChipClick} onNavigate={trackDocClick} />
                  ))}
                </div>
              </section>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Docs;
