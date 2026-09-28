# UN 평화축제 "나와 맞는 평화 활동 찾기" 기술 설계

- 작성일: 2026-09-28
- 기획 원문: Notion [UN 평화축제 기획](https://app.notion.com/p/3e8aad23209680c697a3f99fa6fa6ebe)
- 행사 기간: 2026-10-23 ~ 10-25 (3일), 부스 현장 시연
- 상태: 설계 승인, 구현 계획 작성 전

이 문서는 기획 페이지에 없는 **기술 결정**만 다룬다. 질문 8개, 유형 6개, 카드 문구, 스코어링 규칙의 원본은 기획 페이지가 SSOT이고, 여기서는 그것을 코드에 어떻게 싣는지만 정한다.

## 1. 설계 5줄

1. **입력**: 8문항 각각의 선택 인덱스(0~3)와 정적 질문·유형 데이터. 서버 입력 없음.
2. **출력**: 6개 유형 중 1개, 그 유형의 결과 카드, 추천 동아리 태그에서 `/clubDetail/@{동아리명}`으로 이동.
3. **불변식**: 각 선택지는 정확히 한 유형에 +1. 8답이 모두 있을 때만 결과가 나온다. 동점은 고정 우선순위(일상 → 포용 → 활력 → 표현 → 돌봄 → 탐구)로 단일 결정. 테스트 구간은 네트워크 호출 0회, 저장 0건.
4. **실패 모드**: 결과 URL 직접 진입·새로고침 시 유형 쿼리가 없거나 유효하지 않으면 `/peace`로 돌려보낸다. 정적으로 박은 동아리 이름이 바뀌면 그 태그의 링크가 깨진다.
5. **자료구조·경계**: 질문·유형은 타입이 붙은 TS 상수. 채점은 순수 함수 하나. 결과 유형은 URL 쿼리로 전달. 기존 앱과 공유하는 것은 `AppRoutes`의 라우트 3개와 `eventName.ts` 상수만이다.

## 2. 결정 요약

| 항목 | 결정 | 이유 |
|---|---|---|
| 라우트 위치 | `AppLayout` 바깥 독립 라우트 (`/game`과 같은 위치) | 하단 네비 없이 전체 화면 사용, 행사 후 라우트 블록 하나만 삭제 |
| 화면 골격 | 다른 공개 페이지와 동일. 데스크톱 `Header`, 모바일·태블릿·웹뷰 `WebviewTopBar`, 웹뷰에서 `Footer` 숨김 | 기존 패턴 유지(`IntroducePage`와 동일) |
| 데이터 | TS 상수 (`data/questions.ts`, `data/peaceTypes.ts`) | JSON보다 유형 ID 오타를 컴파일에서 잡음 |
| 결과 전달 | `/peace/result?type={PeaceTypeId}` 쿼리 | 새로고침 안전, 이후 공유 버튼 붙일 때 재사용 |
| 추천 동아리 | "부경대 학생이라면?" 토글을 열 때 모아동 API(`useGetCardList`, 분과 필터)로 받아 모집중을 앞세운 3개를 홈과 같은 `ClubCard`로 표시 (2026-09-28 변경) | 정적 이름은 이름 변경에 깨지고 18개를 손으로 골라야 함. 토글 열 때만 요청하므로 퀴즈 구간은 여전히 네트워크 0회 |
| 카드 이미지 제작 | 디자이너 리소스 없음. 이미지 생성 AI(또는 blender-mcp)로 직접 제작, 그 전까지 장식 카드로 출시 가능 | 2026-09-28 결정 |
| 결과 카드 3D | Blender 렌더 이미지 6장 + framer-motion CSS 3D 연출 | 새 의존성 0, 오프라인·태블릿에 가벼움. three.js는 3일 행사에 과함 |
| 홈 배너 | 프론트 코드 변경 없음. 운영 페이지로 배너 데이터 등록 | 배너는 API 데이터이고 내부 경로 `linkTo`는 이미 처리됨 |
| 카드 색 | `theme.colors.secondary[1~6]` 분과 토큰 그대로 | 기획의 "초록"은 실제 토큰(취미교양, 민트)으로 맞춤 |

## 3. 라우트

`frontend/src/routes/AppRoutes.tsx`의 독립 라우트 구간(`/game` 인접)에 3개를 추가한다. 모두 `ContentErrorBoundary`로 감싼다. 가드 없음.

| 경로 | 컴포넌트 | 역할 |
|---|---|---|
| `/peace` | `PeaceIntroPage` | 소개 문구 + "시작하기" → `/peace/quiz` |
| `/peace/quiz` | `PeaceQuizPage` | 8문항을 한 화면에 하나씩. 8번째 답 선택 시 채점 후 `/peace/result?type=…`로 `replace` 이동 |
| `/peace/result` | `PeaceResultPage` | 결과 카드 + 상세 + 추천 동아리 태그 + "다시하기" → `/peace` |

- 사이트맵(`scripts/generate-sitemap.mjs`)과 OG 미들웨어는 건드리지 않는다. 3일 행사 페이지라 색인이 필요 없다.
- 퀴즈 진행 상태는 `PeaceQuizPage`의 `useState`에만 둔다. 새로고침하면 1번 문항부터 다시 시작한다. 부스 운영상 문제 없다.
- 결과 페이지는 `useSearchParams`로 `type`을 읽고, `PEACE_TYPES`에 없는 값이면 `<Navigate to="/peace" replace />`.

## 4. 데이터 모델

`frontend/src/pages/PeacePage/data/`에 둔다.

```ts
// peaceTypes.ts
export type PeaceTypeId =
  | 'carer'      // 돌봄가 · 봉사
  | 'embracer'   // 포용가 · 종교
  | 'daily'      // 일상가 · 취미교양
  | 'explorer'   // 탐구가 · 학술
  | 'energizer'  // 활력가 · 운동
  | 'expresser'; // 표현가 · 공연

export interface PeaceType {
  id: PeaceTypeId;
  name: string;              // 돌봄가
  catchphrase: string;       // 이웃을 돌보고 나누는 평화 메이커
  description: string;       // 2~3줄
  smallAction: string;       // 오늘의 작은 평화 행동
  category: string;          // '봉사' 등, CategoryButtonList와 같은 한글 라벨
  colorIndex: 1 | 2 | 3 | 4 | 5 | 6; // theme.colors.secondary 인덱스
  recommendedClubs: string[]; // 동아리 정확한 이름. 빈 배열 허용
}

export const PEACE_TYPES: Record<PeaceTypeId, PeaceType>;
export const TIE_BREAK_ORDER: PeaceTypeId[] =
  ['daily', 'embracer', 'energizer', 'expresser', 'carer', 'explorer'];
```

```ts
// questions.ts
export interface PeaceQuestion {
  id: number;                      // 1~8
  text: string;
  options: { label: string; type: PeaceTypeId }[]; // 항상 4개
}
export const PEACE_QUESTIONS: PeaceQuestion[]; // length 8
```

문구·배정은 기획 페이지 표를 그대로 옮긴다. 유형별 선택지 등장 횟수는 돌봄 6, 포용 5, 일상 5, 탐구 6, 활력 5, 표현 5 (총 32).

## 5. 채점

`frontend/src/pages/PeacePage/utils/calculatePeaceType.ts`

```ts
export const calculatePeaceType = (
  answers: number[], // answers[i] = i번째 문항에서 고른 option 인덱스
): PeaceTypeId
```

- `answers.length !== PEACE_QUESTIONS.length`이면 throw. 호출 측(퀴즈 페이지)이 8답 완료 후에만 호출하므로 방어가 아니라 계약 위반 표시다.
- 각 답의 `type`에 +1 누적 → 최고점 유형 반환.
- 동점이면 `TIE_BREAK_ORDER`에서 먼저 나오는 유형.

테스트(`calculatePeaceType.test.ts`): 단독 최고점, 2개 동점에서 우선순위 적용, 우선순위 마지막 유형(탐구)이 단독 최고점이면 그대로 반환, 길이 불일치 throw.

## 6. 화면

### 공통
- `useDevice()`의 `isMobile || isTablet || isInAppWebView()`이면 `WebviewTopBar title='나와 맞는 평화 활동 찾기'`, 아니면 `Header`. `!isInAppWebView()`일 때 `Footer`. 세 페이지가 공유하는 `components/PeaceLayout/PeaceLayout.tsx` 하나에 둔다.
- `isTablet`은 501~700px이다. 부스 태블릿(보통 768~1024px)은 `isLaptop`이라 데스크톱 `Header`가 뜬다.
- 글자·버튼은 기존 토큰 중 큰 쪽(`title.title3` 이상, 버튼 높이 56px 이상)을 쓴다. 한 화면에 질문 하나, 선택지 4개는 세로 버튼.
- 개인정보 입력 UI 없음. `localStorage`·`sessionStorage` 쓰지 않음.

### `/peace` 랜딩
- 제목, 2~3줄 소개("연결이 곧 평화"), "시작하기" 버튼.
- 마운트 시 6장 카드 이미지를 `new Image()`로 프리로드해 결과 화면이 네트워크 없이도 뜨게 한다.

### `/peace/quiz`
- 진행 표시(n / 8), 질문, 선택지 4개. 선택 즉시 다음 문항. 뒤로가기 버튼 하나(이전 문항).
- 8번째 선택 시 `calculatePeaceType` → `navigate('/peace/result?type=…', { replace: true })`.

### `/peace/result`
- 첫 화면: `ResultCard` (유형명, 캐치프레이즈, 카드 이미지, 분과 색 배경).
- 스크롤 아래: 설명, 작은 평화 행동, 추천 동아리 태그(칩), "다시하기".
- 태그 클릭: `navigate('/clubDetail/@' + encodeURIComponent(name))` (ClubCard와 동일 방식).
- "다시하기": `navigate('/peace', { replace: true })`. 상태는 URL에만 있으므로 별도 초기화 없음.

### `ResultCard` 3D 연출
- `frontend/src/pages/PeacePage/components/ResultCard/`.
- Blender에서 유형별 카드 6장을 렌더해 WebP(투명 배경, 긴 변 1080px 이하, 장당 200KB 이하 목표)로 `frontend/src/assets/images/peace/`에 둔다.
- 이미지 import는 `components/ResultCard/cardImages.ts`(`Partial<Record<PeaceTypeId, string>>`)에만 둔다. `data/peaceTypes.ts`에 두지 않는 이유는 jest transform이 `.webp`를 stub하지 않아 데이터 모듈을 import하는 채점 테스트가 깨지기 때문이다.
- framer-motion으로 등장 시 뒤집기(`rotateY` 180→0)와, 포인터 위치에 따른 기울기(`perspective` + `rotateX/rotateY` ±10°)를 준다. WebGL 없음.
- 이미지가 준비되지 않은 유형은 장식 카드로 대체한다(`CARD_IMAGES[type]`이 없으면 분과 색 그라데이션 + 유형 심볼 이모지(`PeaceType.symbol`) + 떠다니는 반투명 원 + 모아동 로고). 이미지가 오면 `cardImages.ts`에 import 한 줄만 추가하면 심볼 자리에 이미지가 들어간다. 글자 뒤 하단 그라데이션(Scrim)은 이미지 유무와 무관하게 깔린다(2026-09-28 리뷰 반영).

## 7. 홈 배너 (운영 작업, 코드 변경 없음)

- 배너는 `GET /api/banner?type=…` 데이터다. 기존 백엔드 운영 페이지(`static/dev/index.html`)로 행사 배너를 등록한다.
- `linkTo: '/peace'`. 내부 경로는 `Banner.tsx`의 `handleBannerClick`이 이미 `navigate`로 처리한다.
- 배너 타입은 기기 폭으로 갈린다. 개인 폰용 `WEB_MOBILE`, 태블릿·PC용 `WEB` 두 타입에 모두 등록한다. 앱 홈에도 노출하려면 `APP_HOME` 추가.
- 노출 기간 제어는 등록·삭제로 한다. 프론트 날짜 분기는 두지 않는다.
- 부스 태블릿은 배너를 거치지 않고 `/peace`를 직접 열어 둔다.

## 8. 트래킹

`frontend/src/constants/eventName.ts`에 추가한다. CI(`npm run audit:tracking`)가 미사용 상수를 잡으므로 실제 호출하는 것만 넣는다.

| 상수 | 값 | 속성 | 호출 위치 |
|---|---|---|---|
| `PAGE_VIEW.PEACE_INTRO_PAGE` | `'PeaceIntroPage'` | - | 랜딩 `useTrackPageView` |
| `PAGE_VIEW.PEACE_QUIZ_PAGE` | `'PeaceQuizPage'` | - | 퀴즈 `useTrackPageView` |
| `PAGE_VIEW.PEACE_RESULT_PAGE` | `'PeaceResultPage'` | - | 결과 `useTrackPageView` |
| `USER_EVENT.PEACE_QUIZ_STARTED` | `'Peace Quiz Started'` | - | 시작하기 클릭 |
| `USER_EVENT.PEACE_QUIZ_COMPLETED` | `'Peace Quiz Completed'` | `{ type }` | 8번째 답 선택 |
| `USER_EVENT.PEACE_CLUB_TAG_CLICKED` | `'Peace Club Tag Clicked'` | `{ type, clubName }` | 태그 클릭 |
| `USER_EVENT.PEACE_RETRY_CLICKED` | `'Peace Retry Clicked'` | `{ type }` | 다시하기 클릭 |

`src/constants/CLAUDE.md`가 있으므로 상수 추가 시 해당 문서도 갱신한다.

## 9. 파일 목록

```
frontend/src/pages/PeacePage/
  PeaceIntroPage.tsx / PeaceIntroPage.styles.ts
  PeaceQuizPage.tsx  / PeaceQuizPage.styles.ts
  PeaceResultPage.tsx / PeaceResultPage.styles.ts
  components/PeaceLayout/PeaceLayout.tsx / PeaceLayout.styles.ts
  components/ResultCard/ResultCard.tsx / ResultCard.styles.ts / ResultCard.stories.tsx / cardImages.ts
  data/peaceTypes.ts
  data/questions.ts
  utils/calculatePeaceType.ts / calculatePeaceType.test.ts
frontend/src/assets/images/peace/{carer,embracer,daily,explorer,energizer,expresser}.webp
frontend/src/routes/AppRoutes.tsx          (라우트 3개 추가)
frontend/src/constants/eventName.ts        (상수 7개 추가)
frontend/src/constants/CLAUDE.md           (상수 추가 반영)
```

- 페이지 컴포넌트는 `export default`, 스타일은 `import * as Styled`, transient prop은 `$` 접두사. 기존 규칙 그대로.
- React Compiler가 켜져 있다. 수동 `memo`/`useCallback`/`useMemo`를 넣지 않고, nullable 접근은 옵셔널 체이닝을 쓴다.

## 10. 검증

- `calculatePeaceType.test.ts` 통과.
- `npm run typecheck`, `npm run audit:tracking` 통과.
- `ResultCard.stories.tsx`는 새 컴포넌트라 `build-storybook`은 필수 아님. 6개 유형 스토리를 두어 이미지 교체 시 확인 지점으로 쓴다.
- 수동 시나리오: 8답 → 결과 → 태그 → 동아리 상세 → 브라우저 뒤로 → 결과 유지(URL 쿼리) → 다시하기 → 랜딩. `/peace/result` 직접 진입 시 `/peace`로 이동. 네트워크 끊고 랜딩부터 결과까지 진행되는지 확인(프리로드 후).
- 폭 1024 태블릿에서 골격과 버튼 크기 확인. `useDevice`는 701~1280px을 `isLaptop`으로 분류하므로 부스 태블릿에는 `WebviewTopBar`가 아니라 `Header`가 뜬다. 500px 이하 개인 폰에서 `WebviewTopBar` 확인.

## 11. 미결 사항

| 항목 | 상태 | 영향 |
|---|---|---|
| 유형별 추천 동아리 | 해결(2026-09-28): API로 분과 동아리 3개를 자동 표시 | 정적 이름 배열 제거 |
| Blender 카드 이미지 6장 | 디자이너 작업 필요. 66차 회의록의 "모아동 캐릭터 활용" 방향과 맞춤 | 없으면 분과 단색 카드로 출시 가능 |
| 담당자 | 66차 회의록(9/16) 주간 할 일에 김수현 "평화 축제 관련 테스트"가 있음. 현재 관련 PR·브랜치 없음 | 착수 전 김수현과 담당 확인 |

## 12. 되돌리기

행사 종료 후 제거 순서.

1. 운영 페이지에서 배너 3건(`WEB`, `WEB_MOBILE`, `APP_HOME`) 삭제.
2. `AppRoutes.tsx` 라우트 3개와 `pages/PeacePage/`, `assets/images/peace/` 삭제.
3. `eventName.ts` 상수 7개 삭제(남기면 `audit:tracking`이 미사용으로 잡는다).

1번만으로 진입이 사라지고 2·3번은 다음 정리 PR로 미뤄도 된다.

## 13. 부스 전시용 추가 (2026-09-28, 구현 완료)

전시물로서 "남는 것"과 운영 안정성을 위해 네 가지를 더했다. 모두 프론트 안에서 끝나며 저장소는 여전히 쓰지 않는다(상태는 URL 쿼리로만 전파).

| 항목 | 동작 | 비고 |
|---|---|---|
| 부스 모드 | `?kiosk=1`이면 퀴즈·결과 화면에서 60초 입력이 없을 때 랜딩(`/peace?kiosk=1&src=…`)으로 replace 이동. 헤더·푸터는 일반 화면과 같다(2026-09-28 축소: 원래는 숨겼으나 원 설계와 너무 달라져 되돌림) | `hooks/useIdleReset.ts`, `constants/kiosk.ts`. 동아리 상세로 나간 뒤에는 리셋이 안 되므로 스태프가 되돌린다 |
| 파라미터 전파 | `kiosk`·`src`는 `hooks/usePeaceParams.ts`의 `withParams`로 랜딩→퀴즈→결과→다시하기까지 이어 붙인다 | 저장소 없음 |
| 서브 유형·파트너 | `rankPeaceTypes`가 점수 순 6개를 돌려주고 2등을 `sub` 쿼리로 넘긴다. 결과에 "당신 안에는 ○○도 있어요"와 `PeaceType.partner`(서로를 가리키는 짝: 돌봄↔표현, 포용↔탐구, 일상↔활력) 한 줄 | `sub`가 없거나 `type`과 같으면 줄을 생략 |
| 폰으로 가져가기 | "공유하기" 버튼은 항상 표시(기존 `useShare`, `src=share`). 부스 모드에서는 그 위에 결과 링크(`/peace/result?type&sub&src=qr`, kiosk 제외) QR을 `qrcode.react`로 하나 더 얹는다 | 새 의존성 `qrcode.react@4.2.0` 1개. QR은 `window.location.origin` 기준이라 부스 태블릿은 프로덕션 도메인으로 열어야 폰에서 열린다 |
| 유입 구분 | 모든 `PEACE_*` 이벤트에 `src`(booth/qr/share/없음) 속성. `USER_EVENT.PEACE_SHARE_CLICKED` 추가 | 부스 태블릿은 `/peace?kiosk=1&src=booth`로 연다 |

운영 체크리스트: 부스 태블릿은 프로덕션 도메인의 `/peace?kiosk=1&src=booth`를 전체 화면 브라우저로 연다. 홈 배너 `linkTo`는 `/peace`(부스 파라미터 없이).

## 14. 결과 콘텐츠 확장 (2026-09-28, 구현 완료)

결과가 문장 3개라 "내 얘기" 같지 않다는 판단으로 `PeaceType`을 늘렸다. 성격이 아니라 행동 장면으로 쓰고, 부드러운 약점 한 줄을 넣어 "맞아" 반응을 노린다.

| 필드 | 화면 | 비고 |
|---|---|---|
| `description` | "○○는 이런 사람이에요" 3~4문장 | |
| `strengths[3]` | `#키워드` 칩 3개 | |
| `shinesWhen` | "이럴 때 빛나요" | |
| `caution` | "가끔은 이런 면도" | |
| `smallActions[3]` | "오늘의 작은 평화 행동" 목록 | 기존 `smallAction` 대체 |
| `partnerReason` | "잘 맞는 평화 파트너 · ○○" 아래 한 줄 | |
| `divisionIntro` + `RecommendedClubs` 컴포넌트 | **"부경대 학생이라면?" 토글** 안에서만 표시. `components/RecommendedClubs/`가 `useGetCardList({ category })`로 분과 동아리를 받아 모집중(OPEN·ALWAYS) 우선 3장을 `ClubCard`로 그림. 로딩은 문구, 실패·빈 목록은 숨김. 카드 클릭은 `PEACE_CLUB_CARD_CLICKED` 후 `/clubDetail/@이름` | 일반 시민에게는 접혀 있음. 열면 `USER_EVENT.PEACE_STUDENT_TOGGLE_OPENED` |

토글은 조건부 렌더 버튼(`aria-expanded`)이다. `<details>`를 쓰지 않은 이유는 열림을 이벤트로 세고 테스트에서 상태를 확실히 잡기 위해서다. 분과 소개 문구는 일반적인 활동 묘사이며 특정 동아리 사실을 단정하지 않는다.
