# 테스트 규칙

## 규칙
- 테스트는 Controller/Service/Repository 책임 경계에 맞춰 분리한다.
- 버그 수정은 재현 테스트부터 작성한다.
- 핵심 경로는 성공/실패 케이스를 모두 검증한다.

## Do
- 단위 테스트는 빠르게, 통합 테스트는 계약/영속성 검증에 집중한다.

## Don't
- 구현 디테일에 과도하게 결합된 테스트를 작성하지 않는다.

## 예시
```ts
describe("UsersService.create", () => {
  it("이메일 중복이면 에러를 던진다", async () => {
    repository.exists.mockResolvedValue(true);
    await expect(service.create(input)).rejects.toThrow("email_conflict");
  });
});
```

## 경계
- Controller 테스트는 요청/응답 계약을 검증한다.
- Service 테스트는 비즈니스 규칙을 검증한다.
- Repository 테스트는 DB 매핑/쿼리를 검증한다.

## 테스트 범위
- 신규 기능: 단위 + 통합 최소 1개씩.
- 회귀 수정: 재현 테스트 필수.
