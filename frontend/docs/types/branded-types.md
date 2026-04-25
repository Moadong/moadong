# Branded Types

타입 안전성을 높이기 위해 primitive 타입에 고유한 브랜드를 부여하는 패턴.

## 개요

`string`처럼 범용적인 타입은 컴파일러가 오용을 잡아주지 못한다.

```typescript
// ClubId 자리에 ApplicantId를 넘겨도 타입 에러 없음
function fetchClub(id: string) { ... }
fetchClub(applicantId); // 런타임 버그
```

Branded 타입을 사용하면 컴파일 타임에 잡을 수 있다.

```typescript
function fetchClub(id: ClubId) { ... }
fetchClub(applicantId); // TS 에러: ApplicantId는 ClubId에 할당 불가
```

## 유틸리티 타입

`src/types/branded.ts`에 인프라 레이어만 정의한다.

```typescript
declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;
```

## 현재 구조

ID 타입이 5개 이하로 적으므로 `branded.ts`에 모두 정의한다.

```
src/types/branded.ts       ← Branded<T, B> 유틸리티 + 모든 ID 타입
```

## 향후 확장 시 권장 구조

ID 타입이 늘어나고 도메인 경계가 명확해지면 도메인 파일로 분리한다. 한 파일에 모으면 도메인 간 결합도가 높아지고 변경 이유가 달라지기 때문이다.

```text
src/types/branded.ts       ← Branded<T, B> 유틸리티만
src/types/club.ts          ← ClubId, CalendarId
src/types/application.ts   ← ApplicationFormId
src/types/applicants.ts    ← ApplicantId
src/types/notion.ts        ← DatabaseId
```

### 새 ID 타입 추가 방법 (현재: 중앙 집중)

현재는 `branded.ts`에 직접 추가한다.

```typescript
// src/types/branded.ts
export type ClubId = Branded<string, 'ClubId'>;
export type NewDomainId = Branded<string, 'NewDomainId'>; // 추가
```

도메인 파일 분리 단계로 전환한 후에는 해당 도메인 파일에 정의한다.

```typescript
// src/types/club.ts (향후 분리 시)
import { Branded } from '@/types/branded';

export type ClubId = Branded<string, 'ClubId'>;
```

3. API 응답을 받는 시점에 캐스팅한다

```typescript
const clubId = data.id as ClubId;
```

## 크로스 도메인 참조

다른 도메인 파일에서 ID 타입을 참조할 때는 해당 도메인 파일에서 직접 import한다. 순환 의존성이 생긴다면 `branded.ts`에 임시로 모아두고 도메인 파일에서 re-export하는 방식을 사용한다.

```typescript
// src/types/application.ts
import { Branded } from '@/types/branded';
import type { ClubId } from '@/types/club';

export type ApplicationFormId = Branded<string, 'ApplicationFormId'>;

export interface ApplicationForm {
  id: ApplicationFormId;
  clubId: ClubId;
}
```

## 도입 단계

branded types 도입은 3단계 브랜치로 진행한다.

| 단계 | 브랜치                               | 작업 내용                                                 | 상태 |
| ---- | ------------------------------------ | --------------------------------------------------------- | ---- |
| 1    | `feature/branded-types/core-types`   | `Branded<T, B>` 유틸리티 및 ID 타입 정의                  | 완료 |
| 2    | `feature/branded-types/domain-types` | 도메인 인터페이스 `id` 필드에 branded type 적용           | 완료 |
| 3    | `feature/branded-types/api-layer`    | API 응답 파싱 시점에 캐스팅 유틸 추가 및 임시 캐스팅 정리 | 예정 |

### api-layer 브랜치 작업 계획

**캐스팅 유틸리티 추가**

API 응답을 받는 시점에서 안전하게 branded type으로 변환하는 헬퍼를 `src/types/branded.ts`에 추가한다.

```typescript
export const asClubId = (id: string): ClubId => id as ClubId;
export const asApplicantId = (id: string): ApplicantId => id as ApplicantId;
export const asApplicationFormId = (id: string): ApplicationFormId =>
  id as ApplicationFormId;
export const asDatabaseId = (id: string): DatabaseId => id as DatabaseId;
export const asCalendarId = (id: string): CalendarId => id as CalendarId;
```

**임시 캐스팅 정리 대상**

| 파일                                                                      | 현재 임시 처리               | 개선 방향                                       |
| ------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------- |
| `src/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton.tsx` | `forms as ApplicationForm[]` | API 응답 파싱 시점에 `asApplicationFormId` 적용 |
| `src/pages/AdminPage/.../ApplicantDetailPage.tsx`                         | `questionId as ApplicantId`  | URL params 파싱 유틸 또는 훅에서 처리           |

## 확장 기준

| 상황                           | 대응                                                |
| ------------------------------ | --------------------------------------------------- |
| ID 타입 5개 이하               | `branded.ts`에 모두 정의해도 무방                   |
| ID 타입 증가, 도메인 경계 명확 | 도메인 파일로 분리                                  |
| 크로스 도메인 순환 의존 발생   | `branded.ts`에 공통 ID만 유지, 나머지는 도메인 파일 |
