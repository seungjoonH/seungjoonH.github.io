// type 배지 + 제목 외부 링크 행 (Experience/Project 상세 공용)
import type { MouseEvent, ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { Icon } from '@components/design/icon/Icon';
import styles from './typedExternalLink.module.css';

export interface TypedExternalLinkProps {
  typeLabel: string;
  title: ReactNode;
  href?: string | null;
  ariaLabel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function TypedExternalLink({
  typeLabel,
  title,
  href,
  ariaLabel,
  onClick,
}: TypedExternalLinkProps): ReactNode {
  const content = (
    <>
      <span className={styles.glyph} aria-hidden="true">
        <Icon.Primary name="link" embedded />
      </span>
      <strong className={styles.type}>{typeLabel}</strong>
      <span className={styles.title}>{title}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={styles.root}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return <span className={buildCls(styles.root, styles.disabled)}>{content}</span>;
}

export { styles as typedExternalLinkStyles };
