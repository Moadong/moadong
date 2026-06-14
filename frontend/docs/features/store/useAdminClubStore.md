# useAdminClubStore — 어드민 전역 상태 관리

`AdminClubContext`를 Zustand로 마이그레이션하여 SSE 업데이트로 인한 불필요한 리렌더링을 제거한 store.

## 배경

기존 `AdminClubContext`에는 4개 상태가 묶여 있었다:
- `clubId` — 로그인한 관리자의 클럽 ID
- `hasConsented` — 개인정보 동의 여부
- `applicantsData` — SSE로 실시간 업데이트되는 지원자 데이터
- `applicationFormId` — SSE 연결 트리거용 ID

`applicantsData`가 SSE 이벤트마다 변경되면서 Context를 구독하는 9개 컴포넌트 전부가 리렌더링되었다. `applicantsData`의 실제 소비자는 `ApplicantsTab` 하나뿐이었기 때문에 나머지 8개 컴포넌트의 리렌더링은 불필요했다.

## 구조

```
src/store/useAdminClubStore.ts   — clubId, hasConsented (전역 공유 필요)
src/hooks/useApplicantSSE.ts     — applicantsData + SSE 연결 (ApplicantsTab 스코프)
```

`applicationFormId`는 store에 포함하지 않는다. SSE 훅의 인자로 직접 전달한다.

## Selector 훅

```typescript
import { useAdminClubId } from '@/store/useAdminClubStore';
import { useAdminHasConsented } from '@/store/useAdminClubStore';

const { clubId, setClubId } = useAdminClubId();
const { hasConsented, setHasConsented } = useAdminHasConsented();
```

각 selector 훅은 해당 상태만 구독하므로, 다른 상태가 변경되어도 리렌더링이 발생하지 않는다.

## useApplicantSSE

```typescript
import { useApplicantSSE } from '@/hooks/useApplicantSSE';

const { applicantsData, setApplicantsData } = useApplicantSSE(applicationFormId);
```

- `applicationFormId`가 변경되면 SSE 연결을 재수립한다
- 컴포넌트 언마운트 시 SSE 연결을 자동으로 닫는다
- 에러 발생 시 2초 후 자동 재연결한다
- `setApplicantsData`로 초기 데이터(`useGetApplicants` 결과)를 주입할 수 있다

## 관련 코드

- `src/store/useAdminClubStore.ts` — Zustand store 정의
- `src/hooks/useApplicantSSE.ts` — SSE 연결 관리 및 applicantsData 상태
- `src/apis/clubSSE.ts` — EventSource 생성 유틸
- `src/pages/AdminPage/tabs/ApplicantsTab/ApplicantsTab.tsx` — useApplicantSSE 사용처
