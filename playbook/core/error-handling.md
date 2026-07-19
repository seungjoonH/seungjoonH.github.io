# 에러 처리

## 규칙
- 예측 가능한 에러는 사전에 차단한다.
- 에러를 조용히 삼키지 않는다.
- 에러 코드/메시지는 전역 상수(변수)로 중앙 관리한다.
- 에러 검출/매핑은 중앙 핸들러(필터/미들웨어/어드바이스)로 일원화한다.

## Do
- 도메인 에러를 명시적으로 throw/return 한다.
- 문자열 리터럴 대신 전역 에러 상수를 사용한다.
- 계층별 에러를 중앙 핸들러에서 공통 응답 포맷으로 변환한다.

## Don't
- 빈 catch 블록을 사용하지 않는다.

## Do 예시
```ts
export const ERROR = {
  INVALID_EVENT_PAYLOAD: "invalid_event_payload",
  AUTH_REQUIRED: "auth_required",
} as const;

try { event = JSON.parse(raw); }
catch { throw new Error(ERROR.INVALID_EVENT_PAYLOAD); }
```

## Don't 예시
```ts
try { event = JSON.parse(raw); }
catch { throw new Error("invalid_event_payload"); } // literal 중복 금지
```

## 경계
- 경계 계층에서는 transport 에러를 처리한다.
- 도메인 계층에서는 도메인 에러를 처리한다.

## 테스트 범위
- 성공/실패 경로를 모두 테스트한다.
- 에러 메시지와 상태 코드 매핑을 검증한다.
