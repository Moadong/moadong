# 의존성 그래프 분석 도구

공통 컴포넌트(`src/components/common`)의 응집도·결합도를 검증하기 위해 `dependency-cruiser`와 `madge`를 도입했다.

## 역할 분리

| 목적 | 도구 |
|------|------|
| 시각화 + 순환참조 탐지 | `madge` |
| 규칙 기반 검증 + 메트릭(팬인/팬아웃/instability) | `dependency-cruiser` |

## 규칙 (`.dependency-cruiser.js`)

| 규칙 | severity | 의미 |
|------|----------|------|
| `no-circular` | warn | 순환 참조 — 양방향 결합 |
| `no-orphans` | info | 어디서도 import되지 않는 고립 모듈 (dead code 후보) |
| `common-no-pages` | error | `src/components/common`이 `src/pages`를 참조하면 실패. 공통 컴포넌트가 특정 페이지에 종속되는 응집도 붕괴를 차단 |

TS 경로 별칭(`@/*`)을 인식시키기 위해 `options.tsConfig.fileName: 'tsconfig.json'`을 명시해야 한다.

## npm 스크립트

```bash
npm run analyze:deps      # 규칙 위반 검사 (CI 게이트용)
npm run analyze:metrics   # Ca(팬인)/Ce(팬아웃)/I%(instability) 메트릭 표
npm run analyze:circular  # 순환참조 탐지 (madge)
npm run analyze:graph     # SVG 그래프 생성 (graphviz 필요)
```

`analyze:metrics`는 `depcruise src --focus "^src/components"`로 전체 그래프를 크롤링한 뒤 components만 필터링한다. `src/components`만 크롤링하면 `pages`에서 들어오는 import를 보지 못해 Ca가 전부 0으로 나온다.

## 발견 사례: SearchBox 위치 오분류

첫 실행에서 `common-no-pages` 규칙이 다음 위반을 잡았다.

```text
Header.tsx → pages/MainPage/components/SearchBox/SearchBox.tsx
```

`SearchBox`는 `pages/MainPage`에 위치했지만 실제로는 전역 `Header`에서만 사용되는 범용 검색 컴포넌트였다(의존성도 `components/common`, `store`, `hooks`, `constants`뿐). 페이지 전용 로직이 없어 위치 오분류로 판단, `src/components/common/SearchBox/`로 이동해 해결했다.

## 관련 코드

- `.dependency-cruiser.js` — 규칙 정의
- `package.json` — `analyze:*` 스크립트
- `src/components/common/SearchBox/` — 재분류된 컴포넌트
- `src/components/common/Header/Header.tsx` — SearchBox import 경로
