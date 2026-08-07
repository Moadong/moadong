# Club Detail Duration Frontend Implementation Plan

## Context

- Backend PR: https://github.com/Moadong/moadong/pull/1901
- Backend collection endpoint: `POST /api/analytics/club-detail/duration`
- Admin statistics currently displays `averageDetailDurationSeconds`, but it remains `0초` until the frontend records real detail-page stay duration.
- The backend intentionally does not backfill old data. Statistics become meaningful only after new page visits are collected.

## Goals

- Record club detail page stay duration from the frontend without blocking page navigation or unload.
- Keep anonymous visitor identity stable per browser so the backend can calculate per-person duration.
- Surface the backend's new overview fields in the admin statistics summary.
- Keep analytics collection fire-and-forget. A failed analytics request must not break the user flow.

## Plan Review Summary

The original direction is valid, but the implementation needs these refinements before coding:

- Do not use JSON `sendBeacon` for this contract. Production API can be cross-origin, and `application/json` is not CORS-safelisted. Use `fetch` with `keepalive: true` as the single transport unless the backend later supports a CORS-safelisted payload format.
- Treat hidden-tab behavior explicitly. If the first `visibilitychange` sends the session, the same mounted page should either remain closed for tracking or open a new session when visible again. The first implementation should keep one session per route mount to avoid duplicate counting.
- Keep the duration hook separate from `useTrackPageView`. Mixpanel page tracking and backend product statistics have different failure handling, payloads, and privacy implications.
- Update mocks and API spec in the same PR. Otherwise the admin statistics UI can compile against fields that are not represented in local/mock development.
- Use the repository's Jest setup for hook tests. Existing `useTrackPageView.test.ts` already shows the right testing style for lifecycle, `Date.now`, and `document.hidden`.

## Backend Contract

### Record Detail Duration

```http
POST /api/analytics/club-detail/duration
Content-Type: application/json
```

Request body:

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

Rules expected by the backend:

- `sessionId` must be unique per detail-page stay session.
- `visitorId` must be stable per browser/device.
- `enteredAt` and `leftAt` must be ISO date-time strings.
- `durationSeconds` must be between `1` and `3600`.
- The endpoint is public and rate-limited server-side, so the frontend should call it directly without auth.

### Admin Overview Response

Extend `ClubStatisticsOverview` with:

```ts
interface ClubStatisticsOverview {
  clubId: string;
  clubName: string;
  from: string;
  to: string;
  totalDetailViews: number;
  averageDetailDurationSeconds: number;
  uniqueDetailVisitors: number;
  averageDetailDurationSecondsPerVisitor: number;
  totalApplicants: number;
}
```

Meanings:

- `averageDetailDurationSeconds`: average duration per recorded page stay session, returned as integer seconds.
- `uniqueDetailVisitors`: unique anonymous detail-page visitors in the selected period.
- `averageDetailDurationSecondsPerVisitor`: average total duration per unique visitor in the selected period, returned as integer seconds.

## Implementation Steps

### 1. Add Analytics API Client

Create a focused API module, for example:

- `frontend/src/apis/clubDetailDuration.ts`

Implementation notes:

- Build the URL from `API_BASE_URL`.
- Do not use `secureFetch`; this backend endpoint is public.
- Use `fetch(..., { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })` as the only transport.
- Do not add `navigator.sendBeacon` fallback while the backend request contract is JSON.
- Swallow errors after logging in development only. Analytics failure should not surface to the user.
- Return a boolean or resolved status from the API helper only for tests. Calling UI code should not branch on analytics success.

Recommended send path:

1. `fetch(url, { method: 'POST', headers, body, keepalive: true })`
2. return `false` when the request cannot be started.

Avoid adding credentials or auth headers. This keeps the endpoint public and prevents the analytics call from coupling to admin/user auth state.

### 2. Add Anonymous Visitor ID Utility

Create a browser-only utility, for example:

- `frontend/src/utils/analyticsVisitor.ts`

Behavior:

- Store visitor ID in `localStorage` under a stable key such as `moadong.analytics.visitor_id`.
- Generate with `crypto.randomUUID()` when available.
- Provide a fallback using timestamp plus random value for older browsers.
- Return `undefined` when `window` or `localStorage` is unavailable.
- Catch storage read/write exceptions, because private browsing or browser settings can block storage access.
- Prefix generated IDs, for example `visitor_${uuid}`, to make production logs easier to distinguish from backend IDs.

### 3. Add Detail Duration Hook

Create a hook, for example:

- `frontend/src/hooks/Analytics/useTrackClubDetailDuration.ts`

Inputs:

```ts
useTrackClubDetailDuration({
  clubId: clubDetail?.id,
  clubName: clubDetail?.name,
  skip: !clubDetail,
});
```

Hook behavior:

- Start a new tracking session when a valid `clubId` is ready for the current route.
- Generate one `sessionId` per mounted detail-page session.
- Capture `enteredAt` at session start.
- Send once on the first of:
  - component cleanup,
  - `pagehide`,
  - `beforeunload`,
  - `visibilitychange` when `document.hidden === true`.
- Guard duplicate sends with a ref.
- Calculate duration as `Math.round((Date.now() - enteredAtMs) / 1000)`.
- Clamp duration to backend limits: minimum `1`, maximum `3600`.
- Do not send if `clubId`, `visitorId`, or session metadata is missing.
- Use `clubId` as the tracking lifecycle key so client-side navigation closes the previous session only when the actual loaded club changes.
- Keep current `clubName` in a ref so a late detail fetch can update the outgoing payload without restarting the session unnecessarily.
- Keep one completed session per route mount. If a hidden-tab event sends the payload and the tab becomes visible again without remounting, do not send another record in the first implementation.

This mirrors the existing `useTrackPageView` lifecycle but sends data to the backend statistics endpoint instead of Mixpanel.

### 4. Wire Hook Into Club Detail Pages

Add the hook to both detail page entry points:

- `frontend/src/pages/ClubDetailPage/ClubDetailPage.tsx`
- `frontend/src/pages/LegacyClubDetailPage/LegacyClubDetailPage.tsx`

Use the loaded `clubDetail.id` rather than route params where possible, because the current route can contain either `clubId` or `clubName` depending on entry path.

Recommended call:

```ts
useTrackClubDetailDuration({
  clubId: clubDetail?.id,
  clubName: clubDetail?.name,
  skip: !clubDetail,
});
```

### 5. Update Admin Statistics Types And UI

Update:

- `frontend/src/types/statistics.ts`
- `frontend/src/pages/AdminPage/tabs/StatisticsTab/components/MetricSummary.tsx`
- `frontend/src/pages/AdminPage/tabs/StatisticsTab/StatisticsTab.styles.ts`
- MSW/mock statistics data if present.

UI changes:

- Keep existing `평균 체류 시간` as session average using `averageDetailDurationSeconds`.
- Add `고유 방문자` using `uniqueDetailVisitors`.
- Add `인당 평균 체류 시간` using `averageDetailDurationSecondsPerVisitor`.
- Treat both duration average fields as integer seconds. Do not add decimal rounding in the formatter unless the backend contract changes.
- Adjust `MetricGrid` to support 5 cards responsively, for example desktop `repeat(auto-fit, minmax(180px, 1fr))` and mobile `1fr`.
- Keep labels concise so cards do not overflow on mobile.
- Use the existing `formatNumber` and `formatDuration` helpers. Do not introduce a second duration formatter.

Mock updates:

- `frontend/src/mocks/handlers/index.ts`
  - add `uniqueDetailVisitors`,
  - add `averageDetailDurationSecondsPerVisitor`,
  - optionally add a no-op `POST /api/analytics/club-detail/duration` handler for local development.

### 6. Update Frontend API Spec

Update:

- `docs/spec/club-statistics-frontend-api-spec.md`

Document:

- new overview response fields,
- session average vs per-visitor average distinction,
- frontend collection endpoint dependency.

Also update the "데이터 발생 조건" section:

- 상세 조회 수 is still recorded by the backend detail API.
- 평균 체류 시간 and 인당 평균 체류 시간 are recorded only when the frontend duration endpoint is called.
- Existing historical data before this frontend release has no duration data unless separately backfilled.

## Test Plan

### Unit Tests

Add tests for the new utility, hook, and API client:

- creates and persists a visitor ID when none exists,
- reuses the existing visitor ID,
- returns `undefined` when storage access throws,
- sends one payload on unmount,
- sends only once when multiple unload/visibility events fire,
- starts a new session when `clubId` changes to another club detail route,
- skips when `clubId` is missing or `skip` is true,
- uses `fetch` with `keepalive` and JSON content type,
- returns `false` when fetch cannot be started,
- clamps `durationSeconds` to `1..3600`.

Update statistics UI tests if a local pattern exists:

- renders `고유 방문자`,
- renders `인당 평균 체류 시간`,
- formats both duration fields with existing `formatDuration`.

Recommended commands:

```bash
cd frontend
npm test -- useTrackClubDetailDuration
npm test -- analyticsVisitor
npm test -- MetricSummary
npm run typecheck
npm run build
```

### Manual Verification

- Open a club detail page, stay for several seconds, then navigate away.
- Confirm one request to `/api/analytics/club-detail/duration`.
- Confirm payload includes `clubId`, stable `visitorId`, unique `sessionId`, ISO timestamps, and non-zero `durationSeconds`.
- Revisit the same club and confirm a new `sessionId` with the same `visitorId`.
- Open the admin statistics tab after backend data is recorded and confirm:
  - `평균 체류 시간` is no longer always `0초`,
  - `고유 방문자` is shown,
  - `인당 평균 체류 시간` is shown.

## Risks And Decisions

- `sendBeacon` is intentionally not used for JSON payloads because cross-origin delivery can require preflight and fail on unload paths.
- `fetch keepalive` has browser payload-size limits, but this payload is tiny and suitable for keepalive.
- Sending on `visibilitychange` marks the session as complete when the tab is hidden. If the user returns to the same mounted page, the first implementation will not start a second session until remount/navigation. This matches the existing page-duration tracking style and avoids duplicate records.
- Backend PR must be deployed before this frontend change reaches production. Until then, the fire-and-forget request can fail silently, but real statistics will not accumulate.
- Client-reported duration can be manipulated. Backend rate limiting and session idempotency reduce abuse, but this metric should be treated as product analytics, not billing/security data.
- The metric is anonymous browser/device-based, not authenticated person-based. One person across multiple browsers or devices counts as multiple `visitorId`s.
