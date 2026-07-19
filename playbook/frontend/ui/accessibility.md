# 접근성 규칙

## 규칙
- ARIA보다 native HTML 시맨틱을 우선한다.
- interactive role 요소는 키보드 조작 가능해야 한다.
- 포커스 가능한 요소에 `aria-hidden`을 사용하지 않는다.

## Do
- 가능하면 `<button>`, `<a>`, `<ul>/<li>`를 우선 사용한다.

## Don't
- `tabIndex`/키보드 핸들러 없는 클릭 가능한 `div`를 쓰지 않는다.

## 예시
```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === "Enter" || e.key === " ") onOpen();
};

<div
  role="button"
  tabIndex={0}
  onClick={onOpen}
  onKeyDown={handleKeyDown}
>
  Open
</div>
```

## 경계
- 디자인 시스템은 접근성 기본 컴포넌트를 제공한다.
- 기능 컴포넌트는 라벨/상태를 맥락에 맞게 조합한다.

## 테스트 범위
- 키보드 내비게이션과 활성화 동작을 검증한다.
- 스크린리더 라벨과 role을 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
