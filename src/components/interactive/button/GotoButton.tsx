// 밑줄 텍스트 + 오른쪽 chevron. size / width(hug|stretch) 분리.
import type { MouseEvent, ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { Icon } from '@components/design/icon/Icon';
import { Text } from '@components/design/button/Text';
import type { DesignSize, LayoutWidth } from '@components/design/designTokens';
import styles from './gotoButton.module.css';

export interface GotoButtonProps {
  children: ReactNode;
  ariaLabel: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: DesignSize;
  width?: LayoutWidth;
  /** href일 때 새 탭 (Docs 외부 링크) */
  external?: boolean;
}

export function GotoButton({
  children,
  ariaLabel,
  href,
  onClick,
  disabled,
  size = 'medium',
  width = 'hug',
  external = false,
}: GotoButtonProps): ReactNode {
  const className = buildCls(
    styles.root,
    styles[size],
    width === 'stretch' ? styles.stretch : styles.hug,
    'clickable'
  );
  const content = (
    <>
      <span className={styles.label}>
        <Text.Primary tone="plain" underline>
          {children}
        </Text.Primary>
      </span>
      <span className={styles.icon} aria-hidden="true">
        <Icon.Primary name="angle-right" embedded />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        data-width={width}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      data-width={width}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
