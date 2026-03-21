import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@components/layout/Header';
import { Icon } from '@components/shared/icon/Icon';
import { useDocs } from '../hooks/useDocs';
import { useProjectSearchStore } from '../stores/projectSearchStore';
import { useExperienceFocusStore } from '../stores/experienceFocusStore';
import styles from './docs.module.css';
import { buildCls } from '../utils/cssUtil';
import { useA11y } from '../hooks/useA11y';

const CATEGORY_KEYS = ['tistory', 'notion', 'githubWiki'];
const CATEGORY_LABELS = {
  tistory: 'Tistory',
  notion: 'Notion',
  githubWiki: 'Github Wiki',
};
const PLATFORM_ICON = {
  tistory: 'tistory',
  notion: 'notion',
  githubWiki: 'github',
};

export function Docs() {
  const a11y = useA11y();
  const docs = useDocs();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);
  const setExperienceIdToFocus = useExperienceFocusStore((s) => s.setExperienceIdToFocus);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [expanded, setExpanded] = useState(() => ({ notion: true, githubWiki: false, tistory: false }));

  const categories = useMemo(() => {
    return CATEGORY_KEYS.map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      platformIcon: PLATFORM_ICON[key],
      items: Array.isArray(docs[key]) ? docs[key] : [],
    })).filter((cat) => cat.items.length > 0);
  }, [docs]);

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
        else if (rect.top < startFade) opacity = (startFade - rect.top) / (startFade - endFade);
        setHeaderOpacity(opacity);
      }
      const contentEl = contentRef.current;
      if (contentEl) {
        const rect = contentEl.getBoundingClientRect();
        const startFade = windowHeight * 0.85;
        const endFade = windowHeight * 0.52;
        let opacity = 0;
        if (rect.top <= endFade) opacity = 1;
        else if (rect.top < startFade) opacity = (startFade - rect.top) / (startFade - endFade);
        setContentOpacity(opacity);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleChipClick = (e, doc) => {
    e.preventDefault();
    e.stopPropagation();
    const src = doc.source;
    if (!src) return;
    if (src.type === 'experience' && src.experienceId) {
      setExperienceIdToFocus(src.experienceId);
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    else if (src.type === 'project' && src.searchQuery) {
      setQueryFromShortcut(src.searchQuery);
      const el = document.getElementById('project');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.docsContainer} ref={sectionRef}>
      <div
        className={buildCls(styles.docsHeaderBlock, headerOpacity === 0 && styles.docsHeaderBlockHidden)}
        style={{ opacity: headerOpacity, transition: 'opacity 0.35s ease-in-out' }}
      >
        <div className={styles.docsHeaderWrap}>
          <Header text="Docs" align="center" className={styles.docsTitle} />
        </div>
      </div>

      <nav
        ref={contentRef}
        className={styles.docsNav}
        aria-label={a11y('docs.nav')}
        style={{ opacity: contentOpacity, transform: `translateY(${(1 - contentOpacity) * 18}px)`, transition: 'opacity 0.35s ease-in-out, transform 0.35s ease-in-out' }}
      >
        {categories.map(({ key, label, platformIcon, items }) => {
          const isOpen = expanded[key];
          return (
            <div key={key} className={styles.folderBlock}>
              <button
                type="button"
                className={styles.folderRow}
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                aria-controls={`docs-list-${key}`}
              >
                <span className={buildCls(styles.chevron, isOpen && styles.chevronOpen)} aria-hidden="true" />
                <Icon name={isOpen ? 'dir-open' : 'dir-close'} className={styles.folderIcon} aria-hidden="true" />
                <Icon name={platformIcon} className={styles.platformIcon} aria-hidden="true" />
                <span className={styles.folderLabel}>{label}</span>
              </button>
              <div
                id={`docs-list-${key}`}
                className={buildCls(styles.docListWrap, isOpen && styles.docListWrapOpen)}
                role="region"
                aria-label={a11y('docs.folderRegion', { label })}
              >
                <div className={styles.docListTrack}>
                  {items.map((doc) => (
                    <div key={doc.id} className={styles.docRow}>
                      <Icon name="document" className={styles.docIcon} aria-hidden="true" />
                      {doc.source && doc.chipLabel && (
                        <button
                          type="button"
                          className={styles.docChip}
                          onClick={(e) => handleChipClick(e, doc)}
                          aria-label={a11y('docs.chipNavigate', { chip: doc.chipLabel })}
                        >
                          <span className={styles.docChipIcon} aria-hidden="true">
                            <Icon name="search" />
                          </span>
                          {doc.chipLabel}
                        </button>
                      )}
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.docRowLink}
                      >
                        <span className={styles.docTitle}>{doc.title}</span>
                        <div className={styles.docRowIconWrapper}>
                          <Icon name="angle-right" className={styles.docRowArrow} aria-hidden="true" />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Docs;
