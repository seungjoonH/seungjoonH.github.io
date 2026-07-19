// onClick/href 중 하나로 렌더링할 태그를 고르는 순수 로직. className은 이 계층을 거치지 않는다 — 항상 호출하는 컴포넌트가 자기 스타일 모듈에서 직접 계산한다.
import type { ElementType, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

export type ClickAction =
  | { onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; href?: never }
  | { onClick?: never; href: string };

/** Omit은 유니온에 분배되지 않아 ClickAction의 두 분기를 뭉개버리므로, 분배형 Omit을 별도로 둔다. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export interface ResolvedActionable {
  Tag: ElementType;
  actionProps: {
    onClick?: ClickAction['onClick'];
    href?: string;
    to?: string;
    type?: 'button';
  };
  isButton: boolean;
}

function isExternalHref(href: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
}

function isHashHref(href: string): boolean {
  return href.startsWith('#');
}

/** href가 있으면 외부/hash는 a, 그 외 내부는 Link, 없으면 button으로 렌더링할 태그와 태그별 필수 props를 돌려준다. */
export function resolveActionable(action: ClickAction): ResolvedActionable {
  if (action.href) {
    return isExternalHref(action.href) || isHashHref(action.href)
      ? { Tag: 'a', actionProps: { href: action.href }, isButton: false }
      : { Tag: Link, actionProps: { to: action.href }, isButton: false };
  }
  return { Tag: 'button', actionProps: { type: 'button', onClick: action.onClick }, isButton: true };
}
