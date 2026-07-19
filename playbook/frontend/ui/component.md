# 컴포넌트 규칙

## 규칙
- 렌더링 로직과 상태 전이 로직을 분리한다.
- 컴포넌트 하나는 명확한 책임 하나만 가진다.
- 반복되는 UI 블록은 하위 컴포넌트나 훅으로 추출한다.
- CSS 커스텀 프로퍼티(`--*`)가 필요할 때만 `style={style}`을 쓴다. 그 외 시각 속성은 CSS Module 클래스로 둔다.

## 훅
- 훅은 단일 책임을 가진다.
- 컴포넌트 대응 훅(`useProjectsGrid`, `useExperienceSection` 등)은 그 컴포넌트 기능만 수행한다. 컴포넌트 내 로직을 간소화하기 위함이다.
- 범용 훅(`useResponsive`, `useA11y` 등)도 해당 기능만 수행한다. 도메인 값을 끼워 넣지 않는다.
- 훅 간 값 props drilling을 엄격히 금지한다. 상위가 꺼내서 하위에 넘기지 말고, 하위 훅이 직접 호출한다.

```tsx
// 금지
const { a } = useA();
useB(a);

// 올바름
function useB() {
  const { a } = useA();
  // ...
}
```

- 굳이 코드를 꼬지 않는다. 같은 값을 컴포넌트 → 훅 인자로 돌리지 않는다.
- 훅의 목적인 동작(모달 오픈, 롱프레스 등)은 훅이 처리한다. `(…) => doThing(…)` 콜백으로 컴포넌트에 떠넘기지 않는다.
- 훅은 숫자·문자열 같은 값을 반환한다. `CSSProperties` 조립은 컴포넌트에서 `const style = { ... } as CSSProperties`로 한다.
- 컴포넌트가 `isMobile`이 필요하면 `useResponsive()`에서만 가져온다. 다른 훅 API로 `isMobile`을 재노출하지 않는다.

## Do
- JSX 반환 전에 계산 값과 핸들러를 미리 정리한다.
- CSS var가 필요할 때 훅 값으로 style을 만든 뒤 넘긴다.

```tsx
const { columns, gap } = useProjectsGrid();
const style = {
  '--project-columns': columns,
  '--project-gap': gap,
} as CSSProperties;

return <div className={styles.rows} ref={rowsContainerRef} style={style} />;
```

## Don't
- JSX에 인라인 style 객체를 직접 넣지 않는다.

```tsx
// 금지
<div style={{ '--project-columns': columns, width: 100 } as CSSProperties} />
```

- 훅이 `rowsStyle` 같은 `CSSProperties`를 만들어 반환하지 않는다. 값은 훅, style 조립은 컴포넌트.
- `useFoo(isMobile, onOpen)`처럼 범용 훅 결과·핵심 동작을 인자로 받지 않는다.
- CSS var가 아닌 일반 속성(`width`, `color`, `margin` 등)을 `style`로 넘기지 않는다. 클래스로 둔다.
- React state로 드물게 바뀌는 CSS var를 `ref.current.style.setProperty` + `useEffect`로 동기화하지 않는다. (스크롤·포인터 등 고빈도 DOM 갱신은 `setCssVars` 예외)

## 예시
```tsx
function ResultPanel({ items }: Props) {
  const visibleItems = items.filter((item) => item.visible);
  const isEmpty = visibleItems.length === 0;

  if (isEmpty) return <EmptyState />;
  return <ResultList items={visibleItems} />;
}
```

## 경계
- Page: 라우트 단위 데이터 조합과 화면 구성.
- Component: 렌더링과 조합. CSS var → `style` 조립. 가능하면 로직은 대응 훅으로 내린다.
- Hook (대응): 해당 컴포넌트 기능만. 필요 시 내부에서 범용 훅을 직접 호출한다.
- Hook (범용): `useResponsive` / `useA11y` 등 단일 기능만. style 객체는 만들지 않는다.

## 테스트 범위
- `empty`, `loading`, `data` 렌더링 상태를 검증한다.
- 이벤트-상태 전이 동작을 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
