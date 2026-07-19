// Text / TextButton 타입
import type { ReactNode } from 'react';
import type { ClickAction } from '../actionable';
import type { PressFeedback } from '../pressFeedback';
import type { DesignShape, DesignSize, DesignVariant, LayoutWidth } from '@components/design/designTokens';

export type { TextShape } from '@components/design/button/type';
export type TextButtonVariant = DesignVariant;
export type TextButtonSize = DesignSize;

export type TextButtonProps = ClickAction & {
  iconName?: string;
  children?: ReactNode;
  variant?: TextButtonVariant;
  size?: TextButtonSize;
  /** square(0) | rounded(기본) | full */
  shape?: DesignShape;
  /** 기본 press-shade. Nav 등은 press만 */
  feedback?: PressFeedback;
  /** hug(기본) | stretch — stretch는 :active scale을 끈다 (가로로 긴 버튼에서 과한 축소 방지) */
  width?: LayoutWidth;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
  pressed?: boolean;
};
