// 아이콘·라벨·값을 직접 받는 필드 카드 조합 컴포넌트
import type { ReactNode } from 'react';
import { Card } from '@components/design/card/Card';
import { Icon } from '@components/design/icon/Icon';
import styles from './fieldCard.module.css';

export interface FieldCardProps {
  iconName: string;
  label: string;
  value: string;
  href?: string;
  ariaLabel?: string;
  action?: ReactNode;
}

export function FieldCard({
  iconName,
  label,
  value,
  href,
  ariaLabel,
  action,
}: FieldCardProps): ReactNode {
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        <Icon.Primary name={iconName} kind="fill" embedded />
      </span>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </>
  );

  return (
    <div className={styles.surface}>
      <Card>
        <div className={styles.layout}>
          {href ? (
            <a
              href={href}
              className={styles.content}
              target="_blank"
              rel="noreferrer"
              aria-label={ariaLabel}
            >
              {content}
            </a>
          ) : (
            <div className={styles.content} aria-label={ariaLabel}>
              {content}
            </div>
          )}
          {action ? <span className={styles.actionSlot}>{action}</span> : null}
        </div>
      </Card>
    </div>
  );
}
