# Club Detail Duration Frontend Spec

작성일: 2026-08-06

이 문서는 동아리 상세 페이지 체류 시간 수집을 위한 프론트엔드 구현 계약과 통계 화면 연동 범위를 정리한다.

## 배경

- 백엔드 PR: https://github.com/Moadong/moadong/pull/1901
- 수집 API: `POST /api/analytics/club-detail/duration`
- 관리자 통계 화면은 `averageDetailDurationSeconds`를 표시하지만, 프론트에서 체류 시간을 수집하지 않으면 값이 계속 `0초`로 남는다.
- 기존 과거 데이터는 백필하지 않는다. 이 기능 배포 이후 새 상세 페이지 방문부터 체류 시간 통계가 쌓인다.

## 목표

- 동아리 상세 페이지 체류 시간을 페이지 이동이나 종료 흐름을 막지 않고 기록한다.
- 브라우저 단위 익명 방문자 식별자를 안정적으로 유지한다.
- 관리자 통계 요약에서 세션 평균 체류 시간, 고유 방문자 수, 방문자당 평균 체류 시간을 표시한다.
- 분석 수집 실패는 사용자 흐름에 영향을 주지 않는다.

## 체류 시간 수집 API

```http
POST /api/analytics/club-detail/duration
Content-Type: application/json
```

인증:

- 공개 API
- `Authorization` 헤더를 보내지 않는다.
- 관리자 또는 사용자 로그인 상태와 결합하지 않는다.

요청 body:

```ts
interface ClubDetailDurationRecordRequest {
  clubId: string;
  clubName?: string;
  sessionId: string;
  visitorId: string;
  enteredAt: string;
  leftAt: string;
  durationSeconds: number;
}
```

필드:

- `clubId`: 상세 페이지의 동아리 ID
- `clubName`: 상세 페이지의 동아리명. 로딩이 늦으면 생략 가능
- `sessionId`: 상세 페이지 체류 세션마다 새로 생성하는 ID
- `visitorId`: 브라우저 또는 기기 단위로 유지하는 익명 방문자 ID
- `enteredAt`: 체류 시작 시각. ISO date-time 문자열
- `leftAt`: 체류 종료 시각. ISO date-time 문자열
- `durationSeconds`: 체류 시간. `1..3600` 범위의 초 단위 정수

전송 규칙:

- JSON 요청만 사용한다.
- `navigator.sendBeacon`은 사용하지 않는다. JSON payload는 cross-origin 환경에서 CORS-safelisted 요청이 아니므로 unload 경로에서 실패할 수 있다.
- `fetch`에 `keepalive: true`를 지정한다.
- `secureFetch`는 사용하지 않는다. 이 API는 공개 수집 API이며 인증 상태와 결합하지 않는다.
- 요청 시작 실패나 응답 실패는 사용자에게 노출하지 않는다.
- 개발 환경에서만 디버깅 로그를 남길 수 있다.

권장 호출 형태:

```ts
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  keepalive: true,
});
```

## 익명 방문자 ID

저장 위치:

- `localStorage`
- key 예시: `moadong.analytics.visitor_id`

생성 규칙:

- 기존 값이 있으면 재사용한다.
- `crypto.randomUUID()`가 있으면 우선 사용한다.
- 미지원 브라우저에서는 timestamp와 random 값을 조합한 fallback ID를 만든다.
- 운영 로그에서 구분하기 쉽도록 `visitor_` prefix를 붙인다.
- `window` 또는 `localStorage`를 사용할 수 없거나 저장소 접근이 실패하면 `undefined`를 반환하고 수집을 건너뛴다.

## 상세 페이지 세션 생명주기

세션 시작:

- 유효한 `clubId`가 준비되면 현재 route mount에 대한 새 세션을 시작한다.
- `enteredAt`과 `enteredAtMs`를 함께 저장한다.
- `sessionId`는 세션마다 새로 생성한다.

세션 종료:

- 아래 이벤트 중 가장 먼저 발생한 하나에서 한 번만 전송한다.
  - component cleanup
  - `pagehide`
  - `beforeunload`
  - `visibilitychange`에서 `document.hidden === true`

중복 방지:

- 같은 세션에서 여러 종료 이벤트가 연달아 발생해도 한 번만 전송한다.
- `clubId`가 다른 상세 페이지로 바뀌면 이전 세션을 닫고 새 세션을 시작한다.
- `clubName`은 ref로 최신 값을 유지해 늦게 로딩되어도 payload에 반영할 수 있게 한다.
- 첫 구현에서는 숨김 상태에서 이미 전송한 뒤 같은 mount가 다시 보이더라도 새 세션을 시작하지 않는다.

duration 계산:

- `Math.round((Date.now() - enteredAtMs) / 1000)`로 초 단위 값을 계산한다.
- 백엔드 계약에 맞춰 최소 `1`, 최대 `3600`으로 보정한다.
- `clubId`, `visitorId`, 세션 메타데이터 중 하나라도 없으면 전송하지 않는다.

## 프론트엔드 적용 위치

API client:

- `frontend/src/apis/clubDetailDuration.ts`

익명 방문자 utility:

- `frontend/src/utils/analyticsVisitor.ts`

tracking hook:

- `frontend/src/hooks/Analytics/useTrackClubDetailDuration.ts`

상세 페이지 연결:

- `frontend/src/pages/ClubDetailPage/ClubDetailPage.tsx`
- `frontend/src/pages/ClubDetailPage/LegacyClubDetailPage.tsx`

권장 hook 호출:

```ts
useTrackClubDetailDuration({
  clubId: clubDetail?.id,
  clubName: clubDetail?.name,
  skip: !clubDetail,
});
```

route param보다 로딩된 `clubDetail.id`를 우선 사용한다. 현재 상세 페이지 진입 경로는 `clubId` 또는 `clubName` 기반일 수 있다.

## 관리자 통계 연동

관련 API 문서:

- `docs/spec/club-statistics-frontend-api-spec.md`

요약 응답의 체류 시간 관련 필드:

```ts
interface ClubStatisticsOverview {
  averageDetailDurationSeconds: number;
  uniqueDetailVisitors: number;
  averageDetailDurationSecondsPerVisitor: number;
}
```

표시 규칙:

- `평균 체류 시간`: `averageDetailDurationSeconds`
- `고유 방문자`: `uniqueDetailVisitors`
- `인당 평균 체류 시간`: `averageDetailDurationSecondsPerVisitor`
- 두 duration 필드는 모두 초 단위 정수다.
- 기존 `formatNumber`, `formatDuration` helper를 재사용한다.

데이터 발생 조건:

- 상세 조회 수는 공개 상세 조회 API 호출 시 백엔드가 기록한다.
- 평균 체류 시간과 인당 평균 체류 시간은 프론트가 `POST /api/analytics/club-detail/duration`을 호출한 뒤부터 기록된다.
- 이 기능 배포 이전의 기존 데이터에는 체류 시간 값이 없다.

## 테스트 기준

unit test:

- visitor ID가 없을 때 새로 생성하고 저장한다.
- 기존 visitor ID를 재사용한다.
- storage 접근이 실패하면 `undefined`를 반환한다.
- unmount 시 payload를 한 번 전송한다.
- unload, pagehide, visibilitychange가 연달아 발생해도 한 번만 전송한다.
- `clubId`가 바뀌면 새 세션을 시작한다.
- `clubId`가 없거나 `skip`이면 전송하지 않는다.
- `fetch`가 `keepalive`와 JSON content type으로 호출된다.
- fetch 시작 실패 시 실패 상태를 반환하되 사용자 흐름은 막지 않는다.
- `durationSeconds`를 `1..3600` 범위로 보정한다.
- 통계 요약 UI가 `고유 방문자`, `인당 평균 체류 시간`을 표시한다.

권장 검증 명령:

```bash
cd frontend
npm test -- useTrackClubDetailDuration
npm test -- analyticsVisitor
npm test -- MetricSummary
npm run typecheck
npm run build
```

수동 검증:

- 동아리 상세 페이지에 진입한 뒤 몇 초 머무르고 이동한다.
- `/api/analytics/club-detail/duration` 요청이 한 번 발생하는지 확인한다.
- payload에 `clubId`, stable `visitorId`, unique `sessionId`, ISO timestamp, 0보다 큰 `durationSeconds`가 포함되는지 확인한다.
- 같은 브라우저에서 다시 방문하면 `visitorId`는 유지되고 `sessionId`는 새로 생성되는지 확인한다.
- 관리자 통계 화면에서 평균 체류 시간, 고유 방문자, 인당 평균 체류 시간이 표시되는지 확인한다.

## 결정 사항과 리스크

- JSON 계약이므로 `sendBeacon` fallback은 두지 않는다.
- `fetch keepalive`는 payload 크기 제한이 있지만 이 요청 payload는 작아서 적합하다.
- 숨김 탭 전송 후 같은 mount에서 다시 보이는 경우 추가 세션을 만들지 않는다. 중복 기록 방지를 우선한다.
- 백엔드 배포 전에는 수집 요청이 실패할 수 있지만, fire-and-forget 흐름이므로 사용자 기능은 유지된다.
- client-reported duration은 조작 가능하다. 이 값은 보안 또는 과금 지표가 아니라 제품 분석 지표로만 취급한다.
- 익명 방문자는 인증 사용자가 아니라 브라우저 또는 기기 단위다. 같은 사람이 여러 브라우저나 기기를 쓰면 여러 방문자로 집계된다.
