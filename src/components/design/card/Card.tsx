// 불투명 배경의 범용 카드 컨테이너
import type { ReactNode } from 'react';
import styles from './card.module.css';
import type { CardProps } from './type';

export function Card({ children }: CardProps): ReactNode {
  return (
    <div data-card="" className={styles.card}>
      {children}
    </div>
  );
}
