# React Query 규칙

## 규칙
- 서버 상태 관리는 React Query를 기본으로 사용한다.
- 쿼리 키는 도메인 단위로 일관되게 설계한다.
- 데이터 변경 후 관련 쿼리를 명시적으로 invalidate 한다.

## Do
- 공통 훅에서 `useQuery`, `useMutation` 패턴을 표준화한다.

## Don't
- 컴포넌트마다 fetch 로직과 캐시 무효화 규칙을 중복 작성하지 않는다.

## 예시
```ts
const useUserQuery = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => api.getUser(id),
  });

const useUpdateUser = () =>
  useMutation({
    mutationFn: api.updateUser,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["user", vars.id] });
    },
  });
```

## 경계
- UI 컴포넌트는 훅을 호출하고 렌더링만 담당한다.
- 데이터 호출/캐시 정책은 query 훅 계층에서 담당한다.

## 테스트 범위
- 쿼리 키 충돌과 캐시 무효화 동작을 검증한다.
- 성공/실패/로딩 상태 렌더링을 검증한다.
- 변경 완료 전 프론트 테스트 또는 최소 타입체크/린트를 반드시 수행한다.
