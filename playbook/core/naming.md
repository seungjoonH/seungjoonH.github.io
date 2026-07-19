# 네이밍

## 규칙
- 이벤트 핸들러는 handleXxx를 사용한다.
- 불리언은 is/has/can 접두사를 사용한다.
- temp/value/data 대신 도메인 용어를 사용한다.

## Do
- 행동과 비즈니스 의미를 기준으로 이름을 짓는다.

## Don't
- 운영 코드에서 모호한 플레이스홀더 이름을 쓰지 않는다.

## Do 예시
```ts
const hasPermission = user.role === "admin";
function handleSubmit() {
  if (!hasPermission) return;
  save();
}
```

## Don't 예시
```ts
const value = user.role === "admin";
function submit() {
  if (!value) return;
  save();
}
```

## 경계
- 네이밍 정책은 전 모듈에 적용한다.
- 예외는 팀 합의로만 허용한다.

## 테스트 범위
- PR 체크리스트에 네이밍 검토를 포함한다.
- 핵심 모듈의 모호한 식별자를 거절한다.
