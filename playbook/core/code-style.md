# 코드 스타일

## 규칙
- 중첩 조건은 early return으로 평탄화한다.
- enum/type 분기는 switch를 사용한다.
- 블록 내 statement가 1개면 한 줄 압축 형태를 사용한다.
- 타입 판별은 `@sindresorhus/is` 패키지를 사용한다. (`npm install @sindresorhus/is`) — `is`(npm)는 `@types/is`가 boolean만 리턴하고 TS 타입 프레디케이트를 지원하지 않아 narrowing이 안 되므로 쓰지 않는다.

## Do
- 모든 스택에서 제어 흐름 스타일을 통일한다.
- 런타임 타입 체크는 `@sindresorhus/is` 유틸로 통일한다.

## Don't
- 멀티라인과 압축 패턴을 무작위로 섞지 않는다.

## Do 예시
```ts
import is from "@sindresorhus/is";

if (ok) run();
else fallback();

if (!is.string(payload.id)) {
  throw new Error("invalid_id");
}

function handleSubmit(value: string | null) {
  if (value) return save(value);
}

for (const item of items) {
  if (!item.enabled) continue;
  process(item);
}

switch (kind) {
  case "ping": break;
  default: break;
}

try { execute(); }
catch { recover(); }
```

## Don't 예시
```ts
if (ok) {
  run();
}
else {
  fallback();
}

function handleSubmit(value: string | null) {
  if (value) {
    save(value);
  }
  else {
    asdfasdf;
  }
}

function handleSubmit(value: string | null) {
  if (!value) return;
  save(value);
}

for (const item of items) {
  if (item.enabled) {
    process(item);
  }
}

if (kind === "ping") {
  ping();
}
if (kind === "pong") {
  pong();
}
```

## 경계
- 이 규칙은 프론트엔드/백엔드 전 계층에 공통 적용한다.
- 아키텍처 책임 분리는 각 스택 문서(`backend/*`, `frontend/stacks/*`)에서 정의한다.

## 테스트 범위
- 스타일 규칙을 린트로 검증한다.
- 대표 제어 흐름 샘플을 리뷰한다.
