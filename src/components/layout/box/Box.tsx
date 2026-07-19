// 레이아웃 width 축을 해석하는 보이지 않는 Box primitive
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import type { LayoutWidthProps } from '@components/design/designTokens';
import styles from './box.module.css';

export interface BoxProps extends LayoutWidthProps {
  children: ReactNode;
}

export function Box({ width = 'hug', children }: BoxProps): ReactNode {
  return (
    <div className={buildCls(styles.box, styles[width])}>
      {children}
    </div>
  );
}
