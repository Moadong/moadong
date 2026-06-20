# React Compiler 도입 Feasibility 진단 리포트

> 진단일: 2026-05-29 · 모드: read-only (프로젝트 파일 변경/커밋 없음)
> 도구: `react-compiler-healthcheck@1.0.0` + `eslint-plugin-react-hooks@7.1.1` (임시 디렉토리에서 실행)

## 결론: 도입 가능 — 단, 도입 전 정리할 실제 버그 있음

- **빌드 차단 요소 없음**: healthcheck 결과 `src/` 204개 컴포넌트 전부 컴파일 성공, 비호환 라이브러리 0개. 컴파일러를 켜도 빌드는 깨지지 않음.
- **하지만 ESLint(컴파일러 진단 규칙)가 진짜 버그를 발견**: 특히 **조건부 훅 호출(early return 뒤 훅) 4개 파일** — 오늘도 런타임 크래시 가능성이 있고 컴파일러가 최적화를 건너뛰는 코드. 도입 전 우선 수정 권장.

> **healthcheck vs ESLint 차이(중요)**: healthcheck의 "204/204 컴파일 성공"은 *"빌드가 안 깨진다"*는 뜻이지 *"위반이 없다"*는 뜻이 아님. 컴파일러는 Rules of React 위반 컴포넌트를 조용히 **bail-out**(최적화 제외)하고도 성공으로 집계함. 그래서 위반은 ESLint로만 드러남. → **ESLint 먼저가 옳았던 이유.**

## 1. healthcheck (빌드 가능성)

| 항목 | 결과 |
|------|------|
| 컴파일 커버리지 (src) | 204 / 204 (하드 실패 0) |
| 비호환 라이브러리 | 0개 (styled-components·framer-motion·swiper·react-query·zustand·react-router 통과) |
| StrictMode 이슈 | 해당 없음 |

## 2. ESLint react-hooks v7 (Rules of React 위반)

`src/` 422개 파일 스캔 → **35개 파일에서 53 errors + 9 warnings**.
숫자는 커 보이지만 성격별로 나누면 실제 부담은 작음:

### 🔴 P0 — 진짜 버그, 도입 전 우선 수정 (실제 ~7개 위치)

| 규칙 | 건수 | 내용 | 파일 |
|------|------|------|------|
| `rules-of-hooks` (앱) | 13건 / 4파일 | early return 뒤 훅 호출 → 훅 순서 변동, 런타임 크래시 가능 | `ApplicationFormPage.tsx`(31행 가드)·`ClubCoverEditor.tsx`·`ClubLogoEditor.tsx`·`QuestionBuilder.tsx` |
| `purity` | 3건 / 3파일 | 렌더 중 `useRef(Date.now())` 호출(impure) | `useTrackPageView.ts:13`·`BuskingPage.tsx:37`·`IntroductionPage.tsx:27` |
| `refs` | 3건 / 1위치 | 렌더 중 `ref.current` 읽기(비반응형) | `useGoogleCalendarData.ts:159` |

**수정 방향**
- 조건부 훅: 가드 `return`을 **모든 훅 호출 아래로** 이동 (훅은 항상 같은 순서로 무조건 호출)
- `Date.now()`: lazy ref init — `const r = useRef<number|null>(null); if (r.current === null) r.current = Date.now();` 또는 `useState(() => Date.now())`
- ref 읽기: 렌더 산출물(`isInitialChecking`)을 ref가 아닌 state/쿼리 상태로 도출

### 🟡 P1 — 코드 품질 안티패턴, 점진 정리 (블로커 아님)

| 규칙 | 건수 | 내용 |
|------|------|------|
| `set-state-in-effect` | 27건 / 22파일 | effect 내 동기 setState(연쇄 렌더). 대부분 "prop→state 동기화" 패턴 → 파생 상태/`key` 리셋으로 대체 가능. AdminPage 편집 탭·캘린더 동기화 훅에 집중 |
| `exhaustive-deps` | 9건 (warn) | 의존성 누락. 컴파일러가 stale-closure를 드러낼 수 있어 검토 권장 |

### ⚪ P2 — 노이즈/설정, 버그 아님

| 규칙 | 건수 | 내용 |
|------|------|------|
| `rules-of-hooks` (스토리북) | 7건 / `*.stories.tsx` | Storybook `render` 함수 안 훅 호출. 런타임엔 컴포넌트로 렌더되므로 오탐. 번들에도 미포함 → eslint에서 `**/*.stories.tsx` 오버라이드로 해제 |

## 3. 환경 적합도

| 항목 | 현재 | 평가 |
|------|------|------|
| React | 19.2.3 | ✅ 런타임 폴리필 불필요 |
| 빌드 | Vite 7 + `@vitejs/plugin-react` 5.1.1 | ✅ `babel` 옵션에 컴파일러 주입 |
| Node | 20.19.5 셸 / 22.12.0 .nvmrc | ✅ |
| ESLint | 9 flat config, `eslint-plugin-react-hooks` 미설치 | ⚠️ 가드레일로 추가 권장 |

## 권장 도입 순서 (✅ 2026-05-30 적용 완료 — 하단 "적용 결과" 참고)

1. **ESLint 가드레일 설치**: `eslint-plugin-react-hooks@latest`(v7) `recommended-latest` + `**/*.stories.tsx` 오버라이드
2. **P0 버그 수정** (조건부 훅 4파일 + Date.now 3파일 + ref 1위치)
3. (선택) **P1 점진 정리** — set-state-in-effect 리팩터
4. **컴파일러 연결** (`config/vite.config.ts`):
   ```ts
   react({ babel: { plugins: [['babel-plugin-react-compiler', {}]] } })
   ```
5. **검증**: `npm run build` + `npm test` + Chromatic 시각 회귀로 런타임 동일성 확인

## 재현 방법

```bash
# (1) healthcheck — 빌드 가능성 (설치/파일 변경 없음)
npm exec --yes -- react-compiler-healthcheck@latest --src "src/**/*.{js,mjs,jsx,ts,tsx}"

# (2) ESLint 규칙 — Rules of React 위반 (임시 디렉토리에서, 프로젝트 무변경)
#   임시 dir에 eslint@9 + @typescript-eslint/parser + eslint-plugin-react-hooks@latest 설치 후
#   recommended-latest 규칙으로 src/**/*.{ts,tsx} 린트
```

## 적용 결과 (2026-05-30)

위 권장 순서대로 실제 도입을 완료했다.

- **ESLint 가드레일**: `eslint-plugin-react-hooks@7` `recommended-latest`를 `eslint.config.mjs`에 연결, `**/*.stories.tsx`는 `rules-of-hooks` 오버라이드로 해제. `set-state-in-effect`는 정당한 효과(로딩/구독/OAuth 콜백)·어드민 폼 시드 케이스가 섞여 있어 **error 승격 없이 warn 가드레일로 유지**.
- **P0 버그 수정 (Rules of React 위반)**:
  - 조건부 훅: `ApplicationFormPage`·`ClubCoverEditor`·`ClubLogoEditor`·`QuestionBuilder` — 가드를 모든 훅 호출 아래로 이동
  - purity(렌더 중 `Date.now()`): `useTrackPageView`·`BuskingPage`·`IntroductionPage` — effect/지연 초기화로 전환
  - refs(렌더 중 `ref.current` 읽기): `useGoogleCalendarData` → React Query `isLoading`으로 대체
- **P1 안전 정리(파생 상태화)**: `ApplicantsTab`(selectAll/isChecked), `ClubUnionPage`(matchMedia 지연 초기화). 위험 그룹(어드민 폼 시드)·정당한 효과는 미수정.
- **컴파일러 연결**: `babel-plugin-react-compiler@1.0.0`를 `config/vite.config.ts`의 `@vitejs/plugin-react` `babel.plugins`에 연결(infer 모드).
- **검증**: `npm run build` exit 0(8.48s, tsc 포함), babel 변환 출력에 메모 캐시(`_c(n)`) 생성 확인, 테스트 242/242 통과, eslint 0 errors.

> **남은 검증**: jest(ts-jest)·Chromatic(Storybook 별도 vite)은 컴파일러 미적용이라 런타임 동일성은 `npm run preview`로 컴파일된 dist를 띄워 주요 플로우(어드민 폼·페스티벌·팝업·캘린더 동기화)를 직접 점검 권장.