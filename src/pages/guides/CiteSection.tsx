// 웹 표준 문장 + 번역 + 링크를 blockquote로 보여주는 인용 섹션
import type { ReactNode } from 'react';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { buildCls } from '@utils/cssUtil';
import styles from './accessibility.module.css';

export type CitePart = string | { emph: string };

export interface CiteItem {
  title?: string;
  quote: CitePart[];
  translation: CitePart[];
  source: string;
  href: string;
}

function renderParts(
  parts: CitePart[],
  emphClass: string
): ReactNode {
  return parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={index}>{part}</span>;
    }
    return (
      <strong key={index} className={emphClass}>
        {part.emph}
      </strong>
    );
  });
}

export function CiteSection({ items }: { items: CiteItem[] }): ReactNode {
  if (items.length === 0) return null;
  return (
    <section className={styles.citeSection} aria-label="웹 표준">
      <p className={styles.citeHeading}>웹 표준</p>
      <div
        className={buildCls(
          styles.citeList,
          items.length === 3 && styles.citeListThree
        )}
      >
        {items.map((item) => (
          <blockquote key={item.href} className={styles.citeBlock} cite={item.href}>
            {item.title ? (
              <p className={styles.citeTitle}>{item.title}</p>
            ) : null}
            <p className={styles.citeQuote}>
              {renderParts(item.quote, styles.citeMark)}
            </p>
            <p className={styles.citeTranslation}>
              {renderParts(item.translation, styles.citeBold)}
            </p>
            <footer className={styles.citeFooter}>
              <GotoButton
                href={item.href}
                external
                size="small"
                ariaLabel={item.source}
              >
                {item.source}
              </GotoButton>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
