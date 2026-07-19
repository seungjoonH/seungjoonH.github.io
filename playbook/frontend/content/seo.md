# SEO 규칙

## 규칙
- 라우트별 meta/OG 태그를 관리한다.
- sitemap과 robots 정책을 유지한다.
- 핵심 엔터티에 structured data를 적용한다.
- 색인 가능한 페이지는 canonical URL을 안정적으로 유지한다.

## Do
- canonical URL, 색인 가능 상태, schema 출력값을 검증한다.
- 실제 라우트 소스 기준으로 sitemap 항목을 생성한다.

## Don't
- 중복 title/description, 누락된 robots 정책 상태로 배포하지 않는다.
- 엔터티 중심 페이지에 structured data 없이 배포하지 않는다.

## 예시
```ts
export const metadata = {
  title: "Product Detail",
  description: "Product detail page",
  openGraph: { title: "Product Detail" },
};
```

## 경계
- Page 레이어는 metadata 선언을 담당한다.
- Infra 레이어는 robots/sitemap 배포를 담당한다.
- Content 레이어는 사람 친화 title/description을 소유한다.

## 테스트 범위
- 라우트 metadata 스냅샷 테스트를 수행한다.
- sitemap/robots 엔드포인트를 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
