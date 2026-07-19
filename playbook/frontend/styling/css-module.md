# CSS Module 규칙

## 규칙
- 컴포넌트 스타일은 `*.module.css`에 둔다.
- 인라인 style 객체보다 클래스 토글을 우선한다.
- CSS 커스텀 프로퍼티(`--*`)가 필요할 때만 `const style = { ... } as CSSProperties` → `style={style}`을 쓴다. (상세: `playbook/frontend/ui/component.md`)
- JSX에 `style={{ ... } as CSSProperties}` 인라인을 두지 않는다.
- 클래스명은 컴포넌트 목적 중심으로 짓는다. 예: `styles.projectsHeaderBlock`, `styles.segmentActive` (O) / `styles.wrapper2`, `styles.box` (X).
- 클래스 조합은 아래 `buildCls` 유틸을 사용한다.

## Do
- JSX 반환 전에 className을 계산한다.
- `src/utils/cssUtil.ts` (`@utils/cssUtil`)에 유틸을 두고 재사용한다.
- 동적 CSS var만 미리 만든 `style` 변수로 넘긴다.
- 조건부 클래스는 `buildCls`로 조합한다.

```tsx
import { buildCls } from '@utils/cssUtil';

const className = buildCls(styles.segment, selected && styles.segmentActive);
return <div className={className}>...</div>;
```

## Don't
- 인자가 1개뿐이면 `buildCls`를 쓰지 않는다.

```tsx
// 금지
<div className={buildCls(styles.root)} />
// 올바름
<div className={styles.root} />
```

- `style={{ '--var': value, width: 100 } as CSSProperties}`처럼 인라인+일반 속성 혼합을 쓰지 않는다.
- CSS var가 아닌 일반 속성(`width`, `color`, `margin` 등)을 `style`로 넘기지 않는다. 클래스로 둔다.

## 예시
```tsx
// src/utils/cssUtil.ts
export function buildCls(...args: unknown[]): string {
  return args.filter(Boolean).join(' ').trim();
}

// 사용
const className = buildCls(styles.root, isOpen && styles.open);
return <section className={className}>...</section>;
```

## 경계
- 컴포넌트 모듈은 해당 스타일시트를 소유한다.
- 글로벌 스타일(`global.css`)에는 reset/theme primitive, 그리고 여러 컴포넌트가 공유하는 인터랙션 피드백 유틸리티 클래스만 둔다. 예: `pressFeedback.ts`가 반환하는 `.hoverable`/`.clickable` — 특정 컴포넌트 전용 스타일이 아니라 여러 컴포넌트가 동일하게 재사용하는 hover/press 피드백이므로 global 배치가 허용된다.
- 컴포넌트 전용 시각 스타일(레이아웃, 색상, 간격 등)은 절대 global.css에 두지 않는다. `*.module.css`로 내린다.

## 테스트 범위
- variant 클래스 토글을 검증한다.
- 주요 상태 시각 회귀를 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
