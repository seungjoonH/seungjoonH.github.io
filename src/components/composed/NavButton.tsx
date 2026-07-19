// TextButton(href) 기반 섹션 네비 링크
import type { ReactNode } from 'react';
import { Icon } from '@components/design/icon/Icon';
import { TextButton } from '@components/interactive/button/TextButton';
import styles from './navButton.module.css';

export interface NavButtonProps {
  href: string;
  ariaLabel: string;
  children?: ReactNode;
  iconName?: string;
}

export function NavButton({ href, ariaLabel, children, iconName }: NavButtonProps): ReactNode {
  if (iconName) {
    return (
      <TextButton.Primary href={href} ariaLabel={ariaLabel} size="medium" feedback="press">
        <span className={styles.icon} aria-hidden="true">
          <Icon.Primary name={iconName} embedded />
        </span>
      </TextButton.Primary>
    );
  }

  return (
    <TextButton.Primary href={href} ariaLabel={ariaLabel} size="medium" feedback="press">
      {children}
    </TextButton.Primary>
  );
}
