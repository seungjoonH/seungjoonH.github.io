# 데이터 설계

## 규칙
- UI 로직은 데이터 필드로 먼저 표현한다.
- 분기 확장보다 데이터 모델 수정을 우선한다.

## Do
- 데이터 구조에 의미 필드를 추가한다.

## Don't
- 일회성 if 분기만 계속 늘리지 않는다.

## Do 예시
```ts
const isSpecial = item.kind === "project" && item.status === "deprecated";
```

## Don't 예시
```ts
if (item.kind === "project" && item.status === "deprecated") {
  // special case
}
if (item.kind === "project" && item.isPreview) {
  // another special case
}
```

## 경계
- 데이터 모델이 상태 의미를 소유한다.
- 렌더링 계층은 의미를 소비하고 임의 생성하지 않는다.

## 테스트 범위
- 신규 속성의 스키마 레벨 테스트를 작성한다.
- 데이터 입력 기반 UI 동작 테스트를 작성한다.
