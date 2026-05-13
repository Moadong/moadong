# 메인페이지 카드 레이아웃 히트맵 트래킹

카드 클릭 위치, 스크롤 깊이, 카드 노출 여부를 Mixpanel로 수집해 히트맵 데이터를 구성한다.

백엔드가 카드 순서를 랜덤으로 반환하므로 `card_index` 단독 분석은 의미 없다. 위치 기반 분석은 `scroll_y` + `card_top_in_viewport` 조합을 사용한다.

## 수집 이벤트

### `ClubCard Clicked` (기존 확장)

| 속성                    | 설명                                                 |
| ----------------------- | ---------------------------------------------------- |
| `club_id` / `club_name` | 어떤 클럽이 클릭됐는지                               |
| `card_index`            | 랜덤 순서이므로 클럽별 분석용으로만 사용             |
| `scroll_y`              | 클릭 시점 페이지 스크롤 Y값 (px)                     |
| `card_top_in_viewport`  | 클릭 시점 뷰포트 기준 카드 상단 위치 (px)            |
| `device_type`           | mini_mobile / mobile / tablet / laptop / desktop     |
| `page`                  | 이벤트 발생 페이지 (main / webview-main / introduce) |

### `ClubCard Viewed` (신규)

카드가 뷰포트에 50% 이상 진입 후 3초 체류 시 1회 발생 (IntersectionObserver + dwell timer).

| 속성                    | 설명                                                 |
| ----------------------- | ---------------------------------------------------- |
| `club_id` / `club_name` | 어떤 클럽이 노출됐는지                               |
| `scroll_y`              | 카드 진입 시점 스크롤 Y값 (px)                       |
| `card_top_in_viewport`  | 진입 시점 뷰포트 기준 카드 상단 위치 (px)            |
| `dwell_ms`              | 체류 기준 시간 (고정값 3000)                         |
| `device_type`           | mini_mobile / mobile / tablet / laptop / desktop     |
| `page`                  | 이벤트 발생 페이지 (main / webview-main / introduce) |

### `Scroll Depth Reached` (신규)

스크롤 깊이 마일스톤(25 / 50 / 75 / 100%) 도달 시 1회 발생.

| 속성            | 설명                                             |
| --------------- | ------------------------------------------------ |
| `depth_percent` | 도달한 스크롤 깊이                               |
| `scroll_y`      | 해당 시점 스크롤 Y값 (px)                        |
| `device_type`   | mini_mobile / mobile / tablet / laptop / desktop |
| `page`          | 이벤트 발생 페이지                               |

## 가능한 분석

### 1. 뷰포트 위치 기반 히트맵

`ClubCard Clicked`의 `card_top_in_viewport` 분포를 구간으로 나눠 어느 화면 영역에서 클릭이 집중되는지 파악한다.

```
0~200px: 상단 (스크롤 없이 보이는 영역)
200~500px: 중단
500px~: 하단
```

Mixpanel Insights에서 `card_top_in_viewport`를 custom bucket으로 breakdown하면 된다.

### 2. 클럽별 CTR (노출 대비 클릭률)

```
CTR = ClubCard Clicked 수 / ClubCard Viewed 수  (club_id 기준)
```

같은 클럽이 여러 유저에게 노출된 횟수 대비 실제 클릭된 횟수로, 카드 순서가 랜덤이어도 클럽 자체의 매력도를 측정할 수 있다.

Mixpanel Insights에서 두 이벤트를 `club_name`으로 breakdown 후 비율 계산.

### 3. 스크롤 없이 클릭되는 비율

`ClubCard Clicked`에서 `scroll_y = 0`인 이벤트 비율 → 첫 화면에서 바로 클릭하는 유저 비율.

`scroll_y < 100` 필터로 "사실상 스크롤하지 않은" 케이스를 정의해도 된다.

### 4. 스크롤 이탈 퍼널

`Scroll Depth Reached` 마일스톤별 유저 수로 퍼널을 구성한다.

```
25% 도달: X명
50% 도달: Y명  (이탈률 = 1 - Y/X)
75% 도달: Z명
100% 도달: W명
```

Mixpanel Funnels에서 `depth_percent = 25 → 50 → 75 → 100` 순서로 설정.

### 5. 스크롤 깊이별 클릭 패턴

`ClubCard Clicked`의 `scroll_y` 분포를 보면 유저가 어느 깊이까지 스크롤한 뒤 클릭하는지 알 수 있다.

`scroll_y`가 낮은 클릭이 대부분이라면 → 상위 카드 집중도가 높음  
`scroll_y` 분포가 넓게 퍼지면 → 하단 카드도 고르게 탐색됨

## 통계 해석 시 주의사항

- 클럽별 CTR 비교 시 노출 수(Viewed)가 충분한 클럽만 비교한다. 노출 10회 미만은 노이즈로 간주.
- `card_top_in_viewport`는 뷰포트 크기에 따라 달라지므로 `device_type`으로 필터링해서 디바이스별로 분리해서 보는 것을 권장.
- 필터(카테고리, 검색) 적용 상태에 따라 카드 수와 구성이 달라지므로, 필터 미적용 상태(`category = all`, `keyword = 없음`) 데이터를 기준으로 분석.

## 관련 코드

- `src/pages/MainPage/components/ClubCard/ClubCard.tsx` — 클릭 + impression 트래킹
- `src/hooks/Mixpanel/useScrollTracking.ts` — 스크롤 깊이 트래킹 훅
- `src/pages/MainPage/MainPage.tsx` — `index` 전달 + `useScrollTracking` 적용
- `src/constants/eventName.ts` — 이벤트명 상수
- `src/utils/getDeviceType.ts` — BREAKPOINT 기반 device_type 판별
