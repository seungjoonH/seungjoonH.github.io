# Analytics 제외 처리 컨텍스트

- 2026-07-28: `analytics=off`는 URL에 한 번 나타나면 현재 탭의 `sessionStorage`에 기록해 이후 같은 탭의 이동에서도 모든 분석 이벤트를 중단한다.
- 2026-07-28: User-Agent 제외는 정상 브라우저 오탐을 피하도록 명확한 검색엔진·소셜 미리보기·AI 크롤러 식별자만 대상으로 한다.
- 2026-07-28: 일반 Chrome User-Agent를 사용하는 AI 브라우저는 서버에서 확실히 구분할 수 없으므로 공유 URL의 `analytics=off`가 주 차단 수단이다.
- 2026-07-28: 정리 대상 C09의 원본 Client ID는 `d02ae63d-63ed-4f10-ac4c-0b525edf6fe9`다.
- 2026-07-28: C09는 `q9fxr3m`의 2026-07-28 데이터에만 존재했고 `guide:view` 3건, `guide:tab` 4건이었다. 일별·누적·레거시·랭킹 집계에서 원자적으로 제거했다.
- 2026-07-28: 삭제 후 C09의 일별·누적 Client 필드는 0개이며, components 집계에는 등록된 본인 Client의 `guide:view` 1건과 탭 클릭 4건만 남았다.
- 2026-07-28: `npm test` 98개 테스트, `npm run typecheck`, `npm run build`가 통과했다. 빌드에는 기존 동적/정적 import 및 청크 크기 경고가 남아 있다.
