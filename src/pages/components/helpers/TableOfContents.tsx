// 갤러리 우측 목차 (스크롤 스파이 + 그룹 Heading / indent)
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import styles from './gallery.module.css';
import { buildCls } from '@utils/cssUtil';
import type { GallerySection, TocGroup } from './catalog';
import { GalleryTitle } from './GalleryTitle';

const SCROLL_MARKER_PX = 100;

interface TableOfContentsProps {
  groups: TocGroup[];
}

export function TableOfContents({ groups }: TableOfContentsProps): ReactNode {
  const a11y = useA11y();
  const sections = useMemo(
    () => groups.flatMap((group) => group.sections),
    [groups]
  );
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const onScroll = () => {
      let next = sections[0]?.id ?? '';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= SCROLL_MARKER_PX) {
          next = section.id;
        }
      }
      setActiveId(next);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  const scrollTo = (section: GallerySection) => {
    const el = document.getElementById(section.id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth',
    });
  };

  return (
    <nav className={styles.toc} aria-label={a11y('components.toc')}>
      <h3 className={styles.tocTitle}>{a11y('components.toc')}</h3>
      {groups.map((group) => (
        <div key={group.heading} className={styles.tocGroup}>
          <p className={styles.tocGroupHeading}>{group.heading}</p>
          <ul className={styles.tocList}>
            {group.sections.map((section) => {
              const depth = section.depth ?? 0;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    className={buildCls(
                      styles.tocLink,
                      depth === 1 && styles.tocDepth1,
                      depth === 2 && styles.tocDepth2,
                      activeId === section.id && styles.tocLinkActive
                    )}
                    onClick={() => scrollTo(section)}
                  >
                    <GalleryTitle title={section.title} suffix={section.suffix} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
