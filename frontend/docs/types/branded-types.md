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

## 도메인별 ID 타입 위치

도메인 ID 타입은 해당 도메인 파일에 정의한다. 타입 수가 늘어날수록 한 파일에 모으면 도메인 간 결합도가 높아지므로 아래 구조를 따른다.

```
src/types/branded.ts       ← Branded<T, B> 유틸리티만
src/types/club.ts          ← ClubId, CalendarId
src/types/application.ts   ← ApplicationFormId
src/types/applicants.ts    ← ApplicantId
src/types/notion.ts        ← DatabaseId
```

### 새 ID 타입 추가 방법

1. 해당 도메인 타입 파일을 연다 (없으면 `src/types/<domain>.ts` 생성)
2. `Branded`를 import하고 타입을 정의한다

```typescript
// src/types/club.ts
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

## 확장 기준

| 상황                           | 대응                                                |
| ------------------------------ | --------------------------------------------------- |
| ID 타입 5개 이하               | `branded.ts`에 모두 정의해도 무방                   |
| ID 타입 증가, 도메인 경계 명확 | 도메인 파일로 분리                                  |
| 크로스 도메인 순환 의존 발생   | `branded.ts`에 공통 ID만 유지, 나머지는 도메인 파일 |
