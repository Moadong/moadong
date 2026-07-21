# 관리자 통계 대시보드 구현 계획

작성일: 2026-07-09

## 목표

동아리 관리자 페이지에 `/admin/statistics` 탭을 추가해 내 동아리의 모집 성과를 확인할 수 있게 한다.

백엔드 API 명세는 저장소 루트의 `docs/spec/club-statistics-frontend-api-spec.md`를 기준으로 한다.

## 정보 구조

관리자 사이드바의 `지원 관리` 카테고리에 `통계` 메뉴를 추가한다.

```ts
{
  category: '지원 관리',
  items: [
    { label: '지원서 관리', path: '/admin/application-list' },
    { label: '지원자 현황', path: '/admin/applicants-list' },
    { label: '통계', path: '/admin/statistics' },
  ],
}
```

라우트는 `AdminRoutes.tsx`에 추가한다.

```tsx
<Route path='statistics' element={<StatisticsTab />} />
```

기존 관리자 라우트 구조와 동일하게 `AdminPage`의 `Outlet` 내부에서 렌더링한다. 별도 레이아웃을 만들지 않는다.

## 화면 구성

1. 헤더
   - 기존 `ContentSection.Header` 사용
   - 제목: `통계`
   - `action` 영역에 기간 선택 컨트롤 배치
   - 기본 기간: 최근 7일

2. 요약 KPI
   - 상세 조회수
   - 평균 체류 시간
   - 지원자 수

3. 일자별 추이
   - Recharts 기반 반응형 라인 차트
   - 조회수와 지원자 수를 같은 차트에 표시
   - 평균 체류 시간은 단위가 달라 별도 KPI와 툴팁 보조 값으로만 표시

4. 전체 주요 검색어
   - 전체 검색어 랭킹
   - 가로 막대 또는 순위 리스트
   - UI 문구는 `전체 주요 검색어`로 표기한다. 이 API는 내 동아리 유입 키워드가 아니다.

## 파일 구조

권장 파일 구조:

```txt
src/
  apis/
    statistics.ts
  hooks/
    Queries/
      useStatistics.ts
  pages/
    AdminPage/
      tabs/
        StatisticsTab/
          StatisticsTab.tsx
          StatisticsTab.styles.ts
          components/
            KeywordRanking.tsx
            MetricSummary.tsx
            PeriodSelector.tsx
            TrendChart.tsx
          utils/
            statisticsDate.ts
            statisticsFormat.ts
  types/
    statistics.ts
```

처음 구현에서는 `components/` 하위 컴포넌트만 분리한다. 상태 관리와 API 호출은 `StatisticsTab.tsx`에 둔다. 화면이 커진 뒤에만 컨테이너 훅 분리를 검토한다.

기존 관리자 탭과 같은 방식으로:

- 화면 루트는 `Styled.Container`
- 섹션 제목은 `ContentSection.Header`
- 공통 버튼은 `src/components/common/Button/Button`
- 로딩은 `src/components/common/Spinner/Spinner`
- API 호출은 `src/hooks/Queries` 훅을 통해서만 수행

## API

추가 파일:

- `src/types/statistics.ts`
- `src/apis/statistics.ts`
- `src/hooks/Queries/useStatistics.ts`

### 타입

```ts
export interface ClubStatisticsOverview {
  clubId: string;
  clubName: string;
  from: string;
  to: string;
  totalDetailViews: number;
  averageDetailDurationSeconds: number;
  totalApplicants: number;
}

export interface ClubStatisticsDailyPoint {
  date: string;
  detailViews: number;
  averageDetailDurationSeconds: number;
  applicants: number;
}

export interface ClubStatisticsTrend {
  clubId: string;
  from: string;
  to: string;
  points: ClubStatisticsDailyPoint[];
}

export interface SearchKeywordRankItem {
  keyword: string;
  count: number;
}

export interface SearchKeywordStatistics {
  from: string;
  to: string;
  keywords: SearchKeywordRankItem[];
}
```

### API 함수

모든 요청은 `secureFetch`와 `handleResponse`를 사용한다.

- `getClubStatisticsOverview(from, to)`
- `getClubStatisticsTrend(from, to)`
- `getSearchKeywordStatistics(from, to, limit)`

엔드포인트:

- `GET /api/club/statistics/overview?from={from}&to={to}`
- `GET /api/club/statistics/trend?from={from}&to={to}`
- `GET /api/club/statistics/search-keywords?from={from}&to={to}&limit={limit}`

구현 형태:

```ts
import API_BASE_URL from '@/constants/api';
import type {
  ClubStatisticsOverview,
  ClubStatisticsTrend,
  SearchKeywordStatistics,
} from '@/types/statistics';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

const buildStatisticsUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

export const getClubStatisticsOverview = async (
  from: string,
  to: string,
) => {
  const response = await secureFetch(
    buildStatisticsUrl('/api/club/statistics/overview', { from, to }),
  );
  return handleResponse<ClubStatisticsOverview>(
    response,
    '통계 요약을 불러오지 못했습니다.',
  );
};
```

`apis` 디렉토리 안에서는 기존 파일들처럼 `./auth/secureFetch`, `./utils/apiHelpers` 상대 import를 사용한다. `trend`, `search-keywords`도 같은 패턴으로 작성한다. `limit`은 문자열로 변환해 `URLSearchParams`에 넣는다.

## Query 설계

`queryKeys.ts`에 추가한다.

```ts
statistics: {
  overview: (from: string, to: string) =>
    ['statistics', 'overview', from, to] as const,
  trend: (from: string, to: string) =>
    ['statistics', 'trend', from, to] as const,
  searchKeywords: (from: string, to: string, limit: number) =>
    ['statistics', 'searchKeywords', from, to, limit] as const,
}
```

훅:

- `useClubStatisticsOverview(from, to, enabled)`
- `useClubStatisticsTrend(from, to, enabled)`
- `useSearchKeywordStatistics(from, to, limit, enabled)`

기간이 유효하지 않으면 `enabled: false`로 API 호출을 막는다.

구현 형태:

```ts
export const useClubStatisticsOverview = (
  from: string,
  to: string,
  enabled: boolean,
) =>
  useQuery<ClubStatisticsOverview | undefined>({
    queryKey: queryKeys.statistics.overview(from, to),
    queryFn: () => getClubStatisticsOverview(from, to),
    staleTime: 60 * 1000,
    enabled,
  });
```

세 쿼리는 서로 독립적으로 실패할 수 있다. 화면에서는 하나가 실패해도 전체 화면을 버리지 말고, 섹션별 에러를 보여준다. 단, 기간 오류처럼 클라이언트 검증에서 잡히는 경우에는 세 쿼리를 모두 비활성화한다.

통계는 관리자 화면에서 즉시성이 어느 정도 필요하지만 실시간 폴링 대상은 아니다. 기존 `hooks/Queries/CLAUDE.md` 기준의 일반 데이터 캐싱 정책에 맞춰 `staleTime: 60 * 1000`을 사용한다. `gcTime`은 기본값을 사용한다.

## 기간 선택 정책

기본값은 KST 기준 최근 7일이다.

빠른 선택:

- 최근 7일
- 최근 30일

직접 선택:

- 날짜 입력은 처음 구현에서는 네이티브 `input type="date"`를 사용한다.
- `from > to`면 클라이언트 에러 표시
- 370일 초과면 클라이언트 에러 표시

서버도 동일하게 최대 370일을 검증하므로, 프론트 검증은 불필요한 요청 방지 목적이다.

기존 모집 기간 편집은 `react-datepicker` 기반의 날짜/시간 선택기를 사용하지만, 통계 조회는 날짜만 필요하고 빠른 기간 선택이 중심이다. 따라서 1차 구현에서는 네이티브 date input으로 단순하게 구현한다. 이후 관리자 날짜 입력 UI 통일 작업이 필요해지면 `react-datepicker`로 교체한다.

### 날짜 유틸

브라우저 로컬 타임존에 기대지 말고 KST 날짜 문자열을 직접 만든다. 서버와 사용자가 모두 한국 기준인 화면이므로 `Asia/Seoul` 기준을 명시한다.

```ts
const KST_TIME_ZONE = 'Asia/Seoul';

export const getTodayKstDateKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: KST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
```

최근 N일 기본값:

```ts
export const getRecentDateRange = (days: number) => {
  const today = getTodayKstDateKey();
  const start = new Date(`${today}T00:00:00+09:00`);
  start.setDate(start.getDate() - (days - 1));
  return {
    from: toDateKey(start),
    to: today,
  };
};
```

`toDateKey(date)`는 `date.toISOString().slice(0, 10)`를 쓰면 UTC 변환 때문에 KST 자정 근처에서 오차가 날 수 있다. `getFullYear()`, `getMonth() + 1`, `getDate()`를 zero-padding해서 만든다.

유효성 검증:

- 값 누락: `시작일과 종료일을 선택해주세요.`
- 시작일 > 종료일: `시작일은 종료일보다 늦을 수 없습니다.`
- 370일 초과: `최대 370일까지 조회할 수 있습니다.`
- 종료일 > KST 오늘: `오늘 이후 날짜는 조회할 수 없습니다.`

## Recharts 도입

패키지 추가:

```bash
npm install recharts
```

사용 컴포넌트:

- `ResponsiveContainer`
- `LineChart`
- `Line`
- `XAxis`
- `YAxis`
- `CartesianGrid`
- `Tooltip`
- `Legend`
- `BarChart`
- `Bar`

설치 후 확인:

```bash
npm run typecheck
npm run build
```

React 19 peer dependency 경고가 발생하면 설치 로그를 확인한다. 빌드가 통과하면 진행하고, peer dependency 충돌로 설치가 실패하면 `recharts` 최신 버전을 확인한 뒤 설치한다.

패키지 추가는 `frontend/package.json`과 `frontend/package-lock.json`에 반영한다.

라인 차트:

- `detailViews`: 상세 조회수
- `applicants`: 지원자 수
- X축 날짜는 `MM.dd` 형태로 축약한다.
- 툴팁에는 원본 날짜와 평균 체류 시간을 함께 표시한다.

권장 차트 설정:

```tsx
<ResponsiveContainer width='100%' height={320}>
  <LineChart data={points} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
    <CartesianGrid strokeDasharray='3 3' vertical={false} />
    <XAxis dataKey='date' tickFormatter={formatChartDate} />
    <YAxis allowDecimals={false} />
    <Tooltip content={<StatisticsTooltip />} />
    <Legend />
    <Line
      type='monotone'
      dataKey='detailViews'
      name='상세 조회수'
      stroke={colors.primary[800]}
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 4 }}
    />
    <Line
      type='monotone'
      dataKey='applicants'
      name='지원자 수'
      stroke={colors.secondary[4].main}
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 4 }}
    />
  </LineChart>
</ResponsiveContainer>
```

단일 날짜 데이터에서는 `dot={true}`가 더 잘 보인다. 구현에서는 `points.length <= 1`일 때 dot을 켜는 조건을 둔다.

검색어 차트:

- 1차 구현은 가로 막대형 리스트로 충분하다.
- Recharts `BarChart` 사용 시 모바일에서 라벨이 깨질 수 있으므로, CSS 기반 막대 리스트를 우선 고려한다.

가로 막대 계산:

```ts
const maxCount = Math.max(...keywords.map((item) => item.count), 1);
const widthPercent = Math.max(6, Math.round((item.count / maxCount) * 100));
```

막대 최소 너비를 6%로 두면 count가 낮은 키워드도 보인다.

## 스타일 원칙

기존 관리자 페이지와 맞춘다.

- 본문은 기존 `AdminPage`의 흰색 카드 안에서 렌더링된다.
- 외곽 제목/섹션 구조는 `ContentSection`을 사용한다.
- 내부 섹션은 그림자 없이 얇은 border만 사용한다.
- 내부 카드 반경은 `12px`을 기본으로 한다.
- 주요 색상:
  - primary: `colors.primary[800]`
  - 지원자 수 라인: `colors.secondary[4].main`
  - 검색어 막대: `colors.accent[2].900`
  - border: `colors.gray[300]`
  - 보조 텍스트: `colors.gray[600]`

중첩 카드 느낌을 줄이기 위해 큰 그림자, 강한 배경색, 과한 장식은 사용하지 않는다.

### 컴포넌트별 스타일 기준

`StatisticsTab`

- `display: flex`
- `flex-direction: column`
- `gap: 60px`

기존 `ClubInfoEditTab`, `RecruitEditTab` 루트 컨테이너가 `gap: 60px`를 사용하므로 관리자 탭의 큰 섹션 간격은 여기에 맞춘다. 차트 내부의 작은 묶음에는 `24px` 이하를 사용한다.

`MetricSummary`

- desktop: `grid-template-columns: repeat(3, minmax(0, 1fr))`
- tablet 이하: `grid-template-columns: 1fr`
- 각 KPI 카드 높이는 최소 `104px`

`ChartSection`, `KeywordSection`

- `border: 1px solid colors.gray[300]`
- `border-radius: 12px`
- `padding: 20px`
- tablet 이하 `padding: 16px`

`PeriodSelector`

- 빠른 선택 버튼은 segmented control처럼 보이게 한다.
- 활성 버튼: `colors.primary[800]` 배경, 흰색 텍스트
- 비활성 버튼: 흰색 배경, `colors.gray[300]` border
- date input은 높이 `40px`, radius `10px`

## 모바일 대응

모바일에서는 `SettingsTab` 목록에서 `통계`로 진입한다.

레이아웃:

- KPI 카드는 1열
- 기간 선택은 2열 이하에서 줄바꿈
- 차트 높이: 약 260px
- 검색어 랭킹은 리스트 중심

모바일 화면 예:

```txt
통계
[최근 7일] [최근 30일]
[시작일] [종료일]

[상세 조회수]
[평균 체류 시간]
[지원자 수]

[일자별 추이]
[전체 주요 검색어]
```

## 상태 처리

로딩:

- 기존 `Spinner` 사용
- 세 쿼리가 모두 최초 로딩 중이면 화면 본문에 `Spinner` 표시
- 일부 쿼리만 로딩 중이면 해당 섹션에만 작은 로딩 문구 또는 skeleton 형태의 빈 박스를 표시

에러:

- 조용한 에러 문구
- `다시 시도` 버튼 제공

빈 상태:

- overview 값이 모두 0이고 trend point도 모두 0이면 `선택한 기간에 통계 데이터가 없습니다.`
- 검색어 배열이 비어 있으면 `선택한 기간에 검색어 데이터가 없습니다.`

부분 실패 처리:

- overview 실패: KPI 영역에만 에러 표시
- trend 실패: 차트 영역에만 에러 표시
- search-keywords 실패: 검색어 영역에만 에러 표시
- 세 API가 모두 실패한 경우에도 화면 제목과 기간 선택은 유지한다.

재시도 버튼:

- 각 섹션의 `refetch`를 호출한다.
- 전체 실패 UI를 따로 만들지 않는다.

## 컴포넌트 책임

`StatisticsTab`

- 기간 상태 관리
- 기간 유효성 검증
- 세 쿼리 호출
- 하위 컴포넌트에 데이터/상태 전달
- `useTrackPageView(PAGE_VIEW.ADMIN_STATISTICS_PAGE)` 호출

`PeriodSelector`

- 빠른 기간 선택
- 직접 날짜 입력
- 유효성 메시지 표시
- API 호출을 직접 하지 않는다.

`MetricSummary`

- overview 표시
- 평균 체류 시간 포맷 적용
- overview 로딩/에러/빈 상태 표시

`TrendChart`

- trend points 표시
- Recharts tooltip 렌더링
- 차트 빈 상태 표시

`KeywordRanking`

- search-keywords 표시
- CSS 가로 막대 표시
- 검색어 빈 상태 표시

빈 상태 문구는 별도 공통 컴포넌트로 만들지 않고 각 섹션 컴포넌트 내부에 둔다. 기존 관리자 화면도 작은 빈 상태는 해당 탭 내부에서 직접 처리하는 패턴이 많다.

## 포맷 유틸

`statisticsFormat.ts`:

```ts
export const formatNumber = (value: number) =>
  new Intl.NumberFormat('ko-KR').format(value);

export const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${minutes}분 ${restSeconds}초`;
};

export const formatChartDate = (dateKey: string) => {
  const [, month, day] = dateKey.split('-');
  return `${month}.${day}`;
};
```

`formatDuration(0)`은 `0초`로 표시한다.

## 목 데이터

MSW가 개발 환경에서 켜져 있으므로 필요하면 mock handler를 추가한다.

권장 mock 응답:

- overview: 조회수 128, 평균 체류 43초, 지원자 17명
- trend: 최근 7일 point 전체 포함
- search-keywords: 5개 정도

백엔드 API가 아직 현재 프론트 브랜치에 없거나 로컬 백엔드가 준비되지 않은 경우, MSW 목으로 UI를 먼저 완성한다.

현재 `src/mocks/handlers/index.ts`는 빈 배열만 export한다. mock이 필요하면 별도 파일을 과하게 만들지 말고, 1차 구현에서는 이 파일에 통계 핸들러를 추가한다. mock이 임시 목적이면 구현 완료 후 제거하거나 문서에 남긴다.

## 추적 이벤트

기존 관리자 탭들은 `useTrackPageView`를 사용한다. 통계 탭도 동일하게 처리한다.

`src/constants/eventName.ts`의 `PAGE_VIEW`에 추가:

```ts
ADMIN_STATISTICS_PAGE: '동아리 통계 페이지',
```

선택적으로 기간 버튼 클릭 추적이 필요하면 `ADMIN_EVENT`에 이벤트를 추가할 수 있다. 1차 구현에서는 페이지뷰만 필수로 한다.

## 구현 순서

1. `recharts` 설치
2. statistics 타입/API/query 추가
3. 날짜/포맷 유틸 추가
4. `StatisticsTab` 빈 화면 생성
5. `AdminRoutes.tsx`에 `/admin/statistics` 연결
6. `adminTabs.ts`에 `통계` 메뉴 추가
7. `PAGE_VIEW.ADMIN_STATISTICS_PAGE` 추가 및 페이지뷰 추적 연결
8. `PeriodSelector`와 기간 유효성 검증 구현
9. overview/trend/search-keywords 쿼리 연결
10. KPI 카드 구현
11. Recharts 라인 차트 구현
12. 전체 주요 검색어 랭킹 구현
13. 로딩/에러/빈 상태 보강
14. MSW mock 필요 여부 확인 및 추가
15. 데스크톱/모바일 반응형 확인

## 완료 기준

- `/admin/statistics`로 접근 가능
- 데스크톱 사이드바에 `통계` 메뉴 노출
- 모바일 설정 목록에 `통계` 메뉴 노출
- 기본 최근 7일 통계를 자동 조회
- 기간 변경 시 3개 API가 같은 기간으로 갱신
- 차트가 데이터 없음, 단일 날짜, 긴 기간에서도 깨지지 않음
- API 하나만 실패해도 나머지 섹션은 표시됨
- 직접 선택 기간이 잘못되면 API 요청이 발생하지 않음
- `PAGE_VIEW.ADMIN_STATISTICS_PAGE` 페이지뷰가 기존 tracking hook으로 기록됨
- `npm run typecheck` 통과
- `npm run build` 통과

## 수동 QA 체크리스트

- `/admin` 모바일 설정 목록에서 `통계` 클릭 시 `/admin/statistics`로 이동한다.
- 데스크톱 사이드바에서 `통계` active 상태가 표시된다.
- 기본 진입 시 최근 7일 기간이 선택되어 있다.
- `최근 30일` 클릭 시 시작일과 종료일이 갱신되고 쿼리가 재실행된다.
- 직접 날짜 선택에서 시작일을 종료일보다 늦게 입력하면 에러가 뜨고 API가 호출되지 않는다.
- 데이터가 모두 0인 경우 빈 상태가 보인다.
- 검색어 데이터가 없는 경우 검색어 섹션만 빈 상태가 보인다.
- 긴 키워드는 한 줄 ellipsis 처리되고 count는 가려지지 않는다.
- 모바일 375px 폭에서 버튼/날짜/input/차트 라벨이 겹치지 않는다.
- 로그아웃 후 `/admin/statistics` 접근 시 로그인 페이지로 이동한다.

## 구현 시 주의사항

- `search-keywords`는 전체 검색어 통계다. 내 동아리 유입 키워드처럼 표현하지 않는다.
- 평균 체류 시간은 초 단위 정수다. UI에서는 `mm:ss` 또는 `초`로 변환한다.
- `trend.points`는 백엔드가 결측 날짜를 0으로 채워 내려준다. 프론트에서 날짜 보정 로직을 중복 구현하지 않는다.
- 차트 라이브러리 추가 후 번들 크기 영향이 과하면 차트 컴포넌트 lazy loading을 검토한다.
