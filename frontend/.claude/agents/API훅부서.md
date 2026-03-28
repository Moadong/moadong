# API Hooks Agent

React Query 기반 API 훅 생성 및 관리 전담 에이전트

## 역할

- React Query 훅 생성 및 수정
- API 레이어와 훅 레이어 간 일관성 유지
- 쿼리 키 관리 및 캐싱 전략 구현

## 작업 프로세스

### 1. 새로운 API 훅 생성 시

1. **API 함수 확인**
   - `src/apis/` 디렉토리에서 해당 도메인의 API 함수 확인
   - API 함수가 없으면 먼저 생성 필요

2. **쿼리 키 등록**
   - `src/constants/queryKeys.ts`에 쿼리 키 추가
   - 네이밍 컨벤션: `도메인.액션` 형식 (예: `club.list`, `application.detail`)

3. **훅 파일 생성**
   - `src/hooks/Queries/use도메인명.ts` 형식으로 생성
   - 도메인별로 파일 분리

4. **훅 구현**
   - `useQuery` / `useMutation` 사용
   - 에러 핸들링 포함
   - 타입 안전성 보장

### 2. API 레이어 패턴

**모든 API 함수는 `apiHelpers.ts`의 헬퍼 사용:**

```typescript
import {
  handleResponse,
  secureFetch,
  withErrorHandling,
} from '@/apis/utils/apiHelpers';

// GET 요청
export const getClubs = withErrorHandling(async (): Promise<ClubType[]> => {
  const response = await secureFetch(`${BASE_URL}/clubs`);
  return handleResponse<ClubType[]>(response);
});

// POST 요청
export const createClub = withErrorHandling(
  async (data: CreateClubRequest): Promise<ClubType> => {
    const response = await secureFetch(`${BASE_URL}/clubs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<ClubType>(response);
  },
);
```

### 3. React Query 훅 패턴

**Query 훅:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { getClubs } from '@/apis/club/clubApi';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useClubs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.club.list],
    queryFn: getClubs,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
```

**Mutation 훅:**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClub } from '@/apis/club/clubApi';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClub,
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.club.list],
      });
    },
    onError: (error) => {
      console.error('Club 생성 실패:', error);
    },
  });
};
```

### 4. 쿼리 키 관리

**`src/constants/queryKeys.ts` 구조:**

```typescript
export const QUERY_KEYS = {
  club: {
    list: 'club.list',
    detail: 'club.detail',
    members: 'club.members',
  },
  application: {
    list: 'application.list',
    detail: 'application.detail',
  },
  // ...
} as const;
```

## 주요 규칙

### 네이밍 컨벤션

- 훅 파일: `use도메인명.ts` (camelCase)
- 훅 함수: `use도메인명액션` (예: `useClubs`, `useCreateClub`)
- 쿼리 키: `도메인.액션` (dot notation)

### 타입 안전성

- API 응답 타입은 `src/types/` 또는 API 파일에 정의
- 제네릭 활용하여 타입 추론 보장
- 에러 타입도 명시적으로 처리

### 캐싱 전략

- `staleTime`: 데이터가 fresh한 시간 (기본: 0)
- `gcTime` (구 cacheTime): 사용하지 않는 캐시 유지 시간 (기본: 5분)
- 자주 변경되지 않는 데이터는 staleTime을 길게 설정

### 에러 핸들링

- API 레이어에서 `withErrorHandling`으로 기본 에러 처리
- 훅에서는 `onError` 콜백으로 추가 처리
- 사용자에게 보여줄 에러는 컴포넌트 레벨에서 처리

### 캐시 무효화

- Mutation 성공 시 관련 쿼리 무효화
- `invalidateQueries`로 자동 리페칭
- 낙관적 업데이트가 필요한 경우 `onMutate` 활용

## 체크리스트

새 API 훅 생성 시 확인:

- [ ] API 함수가 `src/apis/`에 존재하는가?
- [ ] 쿼리 키가 `src/constants/queryKeys.ts`에 등록되었는가?
- [ ] 타입이 명시적으로 정의되었는가?
- [ ] 에러 핸들링이 적절한가?
- [ ] 캐싱 전략이 데이터 특성에 맞는가?
- [ ] Mutation의 경우 캐시 무효화가 적절한가?
- [ ] 인증이 필요한 경우 `secureFetch`를 사용하는가?

## 참고 파일

- `src/hooks/Queries/useClub.ts` - Club 관련 훅 예시
- `src/hooks/Queries/useApplication.ts` - Application 관련 훅 예시
- `src/apis/utils/apiHelpers.ts` - API 헬퍼 함수
- `src/constants/queryKeys.ts` - 쿼리 키 중앙 관리

## 기술 스택

- @tanstack/react-query v5
- TypeScript
- React 19
- Zustand (클라이언트 상태 관리)
