# SVG 아이콘 규칙

## 규칙
- 아이콘은 `icons.svg` 스프라이트(`<symbol>`) 기반으로 관리한다.
- 각 `<symbol>`은 동일한 기준 크기(`viewBox`)를 유지한다.
- 아이콘 `fill`은 반드시 `currentColor`를 사용한다.

## Do
- 공통 `Icon` 컴포넌트에서 `<use href={...}>` 패턴으로 렌더링한다.
- 신규 아이콘 추가 시 크기와 좌표계를 기존 심볼과 동일하게 맞춘다.

## Don't
- 컴포넌트마다 개별 SVG 마크업을 복사해서 넣지 않는다.
- 심볼마다 제각각 `viewBox`/색상값을 사용하지 않는다.

## 예시
```tsx
const Icon = memo(function Icon({ name, size }: IconProps) {
  const resolvedName = name || "photo";
  const href = Paths.icons(resolvedName);
  const className = CSSUtil.buildCls(styles.icon, styles[size]);

  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <use href={href} />
    </svg>
  );
});
```

## 경계
- `icons.svg`는 심볼 원본과 크기 규칙을 소유한다.
- `Icon` 컴포넌트는 심볼 선택/렌더링만 담당한다.

## 테스트 범위
- 신규 심볼 추가 시 `viewBox` 일관성을 검증한다.
- 색상 변경이 `currentColor` 기반으로 동작하는지 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
