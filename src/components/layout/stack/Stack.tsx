// 방향과 간격, 정렬을 담당하는 보이지 않는 Stack primitive
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import type { LayoutWidthProps } from '@components/design/designTokens';
import styles from './stack.module.css';

export type StackDirection = 'horizontal' | 'vertical';
export type StackGap = 'none' | 'small' | 'medium' | 'large';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'spaceBetween';
export type StackWrap = 'nowrap' | 'wrap';

export interface StackProps extends LayoutWidthProps {
  children: ReactNode;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: StackWrap;
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 'medium',
  align = 'stretch',
  justify = 'start',
  wrap = 'nowrap',
  width = 'hug',
}: StackProps): ReactNode {
  return (
    <div
      className={buildCls(
        styles.stack,
        styles[direction],
        styles[`gap-${gap}`],
        styles[`align-${align}`],
        styles[`justify-${justify}`],
        styles[wrap],
        styles[width]
      )}
    >
      {children}
    </div>
  );
}
