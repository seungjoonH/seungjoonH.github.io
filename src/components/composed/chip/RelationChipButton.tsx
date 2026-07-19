// 컴포넌트 관계(자식/부모) 이동 링크 칩. type에 따라 variant·아이콘이 정해진다.
import type { ReactNode } from 'react';
import { ChipButton } from '@components/interactive/chip/ChipButton';
import type { RelationChipButtonProps } from './type';

const RELATION_STYLE = {
  inner: { ChipVariant: ChipButton.Secondary, iconName: 'angle-right' },
  outer: { ChipVariant: ChipButton.Outlined, iconName: 'angle-left' },
} as const;

export function RelationChipButton({ type, label, href, size = 'small' }: RelationChipButtonProps): ReactNode {
  const { ChipVariant, iconName } = RELATION_STYLE[type];
  return <ChipVariant label={label} iconName={iconName} size={size} href={href} ariaLabel={label} />;
}
