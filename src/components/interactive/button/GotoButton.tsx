// 밑줄 텍스트 + 오른쪽 chevron. href | onClick 은 ClickAction으로 배타.
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { Icon } from '@components/design/icon/Icon';
import { Text } from '@components/design/button/Text';
import type { DesignSize, LayoutWidth } from '@components/design/designTokens';
import { resolveActionable, type ClickAction } from '../actionable';
import styles from './gotoButton.module.css';

export type GotoButtonProps = ClickAction & {
  children: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  size?: DesignSize;
  width?: LayoutWidth;
  /** href일 때 새 탭 (Docs 외부 링크) */
  external?: boolean;
};

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
  const action: ClickAction = href ? { href } : { onClick };
  const { Tag, actionProps, isButton } = resolveActionable(action);
  const className = buildCls(
    styles.root,
    styles[size],
    width === 'stretch' ? styles.stretch : styles.hug,
    'clickable'
  );

  return (
    <Tag
      {...actionProps}
      className={className}
      data-width={width}
      aria-label={ariaLabel}
      disabled={isButton ? disabled : undefined}
      {...('href' in actionProps && external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span className={styles.label} aria-hidden="true">
        <Text.Primary tone="plain" underline>
          {children}
        </Text.Primary>
      </span>
      <span className={styles.icon} aria-hidden="true">
        <Icon.Primary name="angle-right" embedded />
      </span>
    </Tag>
  );
}
