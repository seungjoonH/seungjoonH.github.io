# 가독성

## 규칙
- 추가 맥락 없이도 의도가 드러나는 코드를 작성한다.
- 관련 로직은 가깝게, 무관한 로직은 분리한다.

## Do
- 명시적인 이름과 작은 단위를 사용한다.

## Don't
- 범용 이름으로 비즈니스 의미를 숨기지 않는다.

## Do 예시
```ts
const isValidTarget = node instanceof Node && ref.current?.contains(node);
if (!isValidTarget) return;
processTarget(node);
```

## Don't 예시
```ts
const data = node && ref.current && ref.current.contains(node);
if (data) {
  processTarget(node);
}
```

## 경계
- 함수는 변경 이유를 하나만 가진다.
- 모듈은 하나의 도메인 관심사를 표현한다.

## 테스트 범위
- PR에서 이름과 흐름을 검토한다.
- 핵심 경로당 대표 테스트 1개 이상을 둔다.
