# 코드 정리

## 규칙
- 미사용 import/export는 즉시 제거한다.
- fallback 남발로 실패를 숨기지 않는다.

## Do
- 우회보다 근본 원인 수정부터 수행한다.

## Don't
- 광범위한 try-catch로 오류를 무시하지 않는다.

## Do 예시
```ts
if (!response.ok) throw new Error("request_failed");
```

## Don't 예시
```ts
try {
  await request();
}
catch {
  // ignore
}
```

## 경계
- 에러 처리는 에러 맥락이 있는 계층에서 수행한다.
- fallback 동작은 명시적으로 리뷰한다.

## 테스트 범위
- 미사용 심볼이 없는지 확인한다.
- 실패 경로가 관측 가능한지 검증한다.
