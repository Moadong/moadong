# Club Statistics Frontend API Spec

작성일: 2026-07-09

이 문서는 동아리 관리자 통계 화면 프론트엔드 구현을 위한 백엔드 API 계약을 정리한다.

## 공통

- 인증: `Authorization: Bearer {accessToken}` 필요
- 응답 래퍼:

```json
{
  "statuscode": "200",
  "message": "ok",
  "data": {}
}
```

- 날짜 형식: `YYYY-MM-DD`
- 통계 날짜 기준: KST(`Asia/Seoul`)
- 조회 가능 기간: `from <= to`, 최대 370일
- 날짜 범위 오류: `400`, code `903-2`, message `통계 조회 기간이 올바르지 않습니다.`
- 권한 없음: `403`, code `700-5`, message `권한이 없습니다.`
- 동아리 없음: `404`, code `600-1`, message `동아리가 존재하지 않습니다.`

## 내 동아리 통계 요약

```http
GET /api/club/statistics/overview?from=2026-07-01&to=2026-07-09
```

권한:

- 로그인 필요
- 현재 로그인한 동아리 관리자 계정의 `clubId` 기준으로 조회

응답 `data`:

```json
{
  "clubId": "club-id",
  "clubName": "동아리명",
  "from": "2026-07-01",
  "to": "2026-07-09",
  "totalDetailViews": 120,
  "averageDetailDurationSeconds": 37,
  "uniqueDetailVisitors": 52,
  "averageDetailDurationSecondsPerVisitor": 86,
  "totalApplicants": 15
}
```

필드:

- `totalDetailViews`: 기간 내 상세 페이지 조회 수 합계
- `averageDetailDurationSeconds`: 기간 내 상세 페이지 방문 세션당 평균 체류 시간. 데이터가 없으면 `0`
- `uniqueDetailVisitors`: 기간 내 상세 페이지 고유 익명 방문자 수. 프론트에서 저장한 `visitorId` 기준
- `averageDetailDurationSecondsPerVisitor`: 기간 내 고유 익명 방문자 1명당 평균 누적 체류 시간. 데이터가 없으면 `0`
- `totalApplicants`: 기간 내 지원서 제출 수 합계

## 내 동아리 일자별 통계 추이

```http
GET /api/club/statistics/trend?from=2026-07-01&to=2026-07-09
```

권한:

- 로그인 필요
- 현재 로그인한 동아리 관리자 계정의 `clubId` 기준으로 조회

응답 `data`:

```json
{
  "clubId": "club-id",
  "from": "2026-07-01",
  "to": "2026-07-09",
  "points": [
    {
      "date": "2026-07-01",
      "detailViews": 10,
      "averageDetailDurationSeconds": 42,
      "applicants": 2
    },
    {
      "date": "2026-07-02",
      "detailViews": 0,
      "averageDetailDurationSeconds": 0,
      "applicants": 0
    }
  ]
}
```

필드:

- `points`: `from`부터 `to`까지 모든 날짜가 오름차순으로 포함된다.
- 해당 날짜의 데이터가 없으면 `detailViews`, `averageDetailDurationSeconds`, `applicants`는 모두 `0`

## 전체 주요 검색 키워드

```http
GET /api/club/statistics/search-keywords?from=2026-07-01&to=2026-07-09&limit=10
```

권한:

- 로그인 필요
- 동아리 관리자 계정이어야 함
- 특정 동아리 유입 키워드가 아니라 전체 검색어 통계

Query:

- `limit`: 선택값, 기본 `10`, 서버에서 `1..50`으로 보정

응답 `data`:

```json
{
  "from": "2026-07-01",
  "to": "2026-07-09",
  "keywords": [
    {
      "keyword": "밴드",
      "count": 34
    },
    {
      "keyword": "축구",
      "count": 12
    }
  ]
}
```

정렬:

- `count` 내림차순
- count가 같으면 `keyword` 오름차순

## 개발자용 Mixpanel 백필

프론트 일반 관리자 화면에서는 사용하지 않는다. 개발자 페이지나 운영 보정 도구가 필요할 때만 사용한다.

```http
POST /api/admin/statistics/mixpanel/backfill?from=2026-07-01&to=2026-07-09
```

권한:

- `ROLE_DEVELOPER` 필요

제약:

- `from <= to`
- 최대 기간은 서버 설정값 기준. 기본 31일
- `to`는 KST 오늘까지만 허용
- Mixpanel 조회 실패: `502`, code `903-1`
- 기간 초과: `400`, code `903-3`

응답 `data`:

```json
{
  "from": "2026-07-01",
  "to": "2026-07-09",
  "fetchedEvents": 100,
  "processedEvents": 90,
  "duplicatedEvents": 5,
  "skippedEvents": 5
}
```

## 데이터 발생 조건

- 상세 조회 수는 아래 공개 상세 조회 API 호출 시 기록된다.
  - `GET /api/club/{clubId}`
  - `GET /api/club/@{clubName}`
- 평균 체류 시간은 프론트가 아래 공개 수집 API를 호출할 때 기록된다.
  - `POST /api/analytics/club-detail/duration`
- 기존 과거 데이터는 별도 백필이 없다면 체류 시간 통계에 반영되지 않는다.
- 검색 키워드는 검색어가 비어있지 않은 동아리 검색 시 기록된다.
- 지원자 수는 지원서 제출 데이터의 `createdAt` 기준으로 집계된다.

## 프론트 구현 메모

- 대시보드 초기 기간은 최근 7일 또는 이번 모집 기간 등 UI 정책에 맞게 선택한다.
- 차트는 `trend.points`만으로 결측 날짜 보정 없이 바로 그릴 수 있다.
- 평균 체류 시간은 초 단위 정수다. UI에서는 `mm:ss` 또는 `초` 표시로 변환한다.
- `averageDetailDurationSeconds`는 방문 세션 평균이고, `averageDetailDurationSecondsPerVisitor`는 익명 방문자별 누적 체류 시간 평균이다.
- 검색 키워드는 전역 지표이므로 "내 동아리 유입 키워드"로 표기하지 않는다.
- 빈 상태:
  - 요약 값이 모두 `0`이면 통계 데이터 없음 상태로 처리 가능
  - `keywords`가 빈 배열이면 기간 내 검색 데이터 없음 상태
