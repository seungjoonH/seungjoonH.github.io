// 갤러리 Name / Complement 제목 (Role→domain, Domain→layer)
import type { ElementType, ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import styles from './gallery.module.css';

interface GalleryTitleProps {
  title: string;
  suffix?: string;
  as?: ElementType;
  className?: string;
}

export function GalleryTitle({
  title,
  suffix,
  as: Tag = 'span',
  className,
}: GalleryTitleProps): ReactNode {
  return (
    <Tag className={buildCls(className)}>
      {title}
      {suffix ? <span className={styles.titleSuffix}> / {suffix}</span> : null}
    </Tag>
  );
}
