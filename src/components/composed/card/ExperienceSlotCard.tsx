// 경력 카드의 미디어·제목·메타·본문·푸터 슬롯만 배치하는 조합 컴포넌트
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import styles from './experienceSlotCard.module.css';

export interface ExperienceSlotCardProps {
  media?: ReactNode;
  title?: ReactNode;
  meta?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  mobileHovered?: boolean;
}

export function ExperienceSlotCard({
  media,
  title,
  meta,
  content,
  footer,
  mobileHovered = false,
}: ExperienceSlotCardProps): ReactNode {
  const cardCls = buildCls(styles.card, mobileHovered && styles.mobileHovered);

  return (
    <div className={cardCls}>
      <div className="columnContainer">
        {media}
        {(title != null || meta != null || content != null) && (
          <div className={styles.content}>
            {title != null ? <div className={styles.company}>{title}</div> : null}
            {meta != null ? <div className={styles.positionRow}>{meta}</div> : null}
            {content}
          </div>
        )}
        {footer != null ? <div className={styles.gotoSlot}>{footer}</div> : null}
      </div>
    </div>
  );
}
