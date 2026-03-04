# 개발자 페이지 컨벤션 & 디자인 가이드

## 1) 목적
- `src/main/resources/static/dev` 하위 정적 페이지에 기능을 추가할 때, 기존 UI/UX 톤과 구현 방식을 일관되게 유지하기 위한 기준 문서.

## 2) 분석 대상
- `src/main/resources/static/dev/index.html`
- `src/main/resources/static/dev/edit.html`
- `src/main/resources/static/dev/dict-edit.html`

## 3) 공통 디자인 토큰

### 타이포그래피
- 기본 폰트: `system-ui, sans-serif`
- 기본 줄간격: `line-height: 1.5`
- 제목 크기:
  - 메인 타이틀: `1.25rem` 내외
  - 섹션 타이틀: `1.1rem` 내외
  - 서브 타이틀: `1rem` 내외

### 색상
- Primary(링크/포커스/강조): `#2563eb`
- Neutral Border: `#e5e7eb`, `#d1d5db`
- Neutral Background: `#f9fafb`, `#f3f4f6`
- Success:
  - 텍스트: `#16a34a` 또는 `#166534`
  - 배경/보더: `#f0fdf4`, `#bbf7d0`
- Error:
  - 텍스트: `#dc2626`
  - 배경/보더: `#fef2f2`, `#fecaca`
- Warning:
  - 텍스트: `#92400e`
  - 배경/보더: `#fffbeb`, `#fde68a`

### 간격/라운드
- 주 사용 간격 단위: `4, 8, 12, 16, 24px`
- 주 사용 반경: `6px`, `8px`

### 폭/레이아웃
- 메인 포털: `max-width: 900px`
- 팝업(동아리 수정): `max-width: 560px`
- 팝업(단어사전 수정): `max-width: 480px`

## 4) 공통 레이아웃 규칙
- 모든 페이지 최상단에 `* { box-sizing: border-box; }` 유지.
- 메인 페이지는 `header + main + section` 구조를 유지.
- 기능 단위는 `section`으로 분리하고, 섹션 기본 스타일은 아래를 유지:
  - `padding: 16px`
  - `border: 1px solid #e5e7eb`
  - `border-radius: 8px`
  - 섹션 간 간격 `margin-bottom: 24px`
- 메인 탐색 링크는 섹션 `id` 앵커(`#...`)와 1:1로 맞춘다.

## 5) 컴포넌트 컨벤션

### 폼
- 입력 컨트롤(`input`, `select`, `textarea`)은 기본적으로 `width: 100%`.
- 레이블은 `.form-row > label` 패턴으로 필드 위에 배치.
- 여러 필드 배치는 `.form-grid` 사용(반응형 `auto-fill + minmax` 유지).

### 버튼
- 기본 버튼 톤:
  - 배경 `#f9fafb`
  - 보더 `1px solid #d1d5db`
  - `border-radius: 6px`
- 상태:
  - hover 시 배경 `#f3f4f6`
  - disabled 시 `opacity: 0.7`, `cursor: not-allowed`
- 비동기 처리 시 버튼 `disabled` + 텍스트 `"처리 중..."` 패턴 사용.

### 메시지/피드백
- 인라인 결과: `.message-box.success | .message-box.error`
- 섹션 배너: `.banner.warn | .banner.error`
- 전역 알림: `.toast.success | .toast.error` (3초 후 사라짐)
- 화면 제어용 유틸:
  - `.hidden { display: none !important; }`
  - `.loading`(로딩 시 시각 피드백)

### 테이블
- 기본: `border-collapse: collapse; width: 100%`
- 셀 보더/패딩: `1px solid #e5e7eb`, `8px`
- 행 hover 배경: `#f9fafb`
- 긴 ID는 `.id-cell` 패턴(ellipsis + title tooltip + 클릭 복사) 재사용.

## 6) 상호작용/구현 컨벤션

### 상태/인증
- 토큰/유저 저장 키는 기존 키 유지:
  - `devPortalToken`
  - `devPortalUserId`
- 로그인 여부에 따라 섹션 노출을 `classList.toggle('hidden', ...)`로 제어.

### API 호출 패턴
- 공통 `headers()` 함수에서 Authorization 헤더를 조립.
- `fetch` 후:
  - `res.ok` 분기
  - `res.status === 403` 명시 처리(개발자 로그인 안내)
  - `try/catch/finally`로 로딩/버튼 복구 보장

### 네이밍
- 버튼 id: `btn + 동사/기능` (`btnLoadDict`, `btnSave`)
- 입력 id: `edit...`, `dict...`, `login...`처럼 도메인 접두어 사용.
- 렌더 함수: `render...`
- 로드 함수: `load...`

## 7) 접근성/사용성 최소 기준
- 모든 인터랙션 요소에 `:focus-visible` 아웃라인 유지 (`2px solid #2563eb`).
- `label for`와 입력 `id`를 항상 연결.
- 버튼은 항상 `type="button"` 또는 `type="submit"` 명시.
- 새 창 링크는 `target="_blank"` 시 `rel="noopener"` 포함.

## 8) 기능 추가 체크리스트
- [ ] 새 기능을 기존 섹션 안에 넣을지, 새 `section`으로 분리할지 결정했다.
- [ ] 새 `section`이면 헤더 내 앵커 링크를 추가하고 `id`를 일치시켰다.
- [ ] 폼은 `.form-row`/`.form-grid` 패턴으로 구성했다.
- [ ] 버튼/배너/메시지 박스는 기존 클래스(`.banner`, `.message-box`, `.toast`)를 재사용했다.
- [ ] 비동기 액션마다 로딩/실패/성공 UI와 버튼 복구 처리를 넣었다.
- [ ] 403/네트워크 오류를 사용자 메시지로 분리 처리했다.
- [ ] 모바일 폭에서 레이아웃 깨짐 없이 동작하는지 확인했다.