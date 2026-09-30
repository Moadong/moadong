# 개발자 페이지 컨벤션 & 디자인 가이드

## 1) 목적
- `src/main/resources/static/dev` 하위 정적 페이지(모아동 운영 포털)에 기능을 추가할 때, UI 톤과 구현 방식을 일관되게 유지하기 위한 기준 문서.
- 포털은 개발자뿐 아니라 운영진도 쓴다. 처음 들어온 사람이 설명 없이 쓸 수 있는지를 기준으로 판단한다.

## 2) 파일 구조
- `dev/index.html` — 마크업만 둔다. 인라인 `<style>`/`<script>`를 새로 넣지 않는다.
- `dev/css/portal.css` — 메인 포털 스타일. 색·간격은 `:root` 토큰만 쓴다.
- `dev/js/*.js` — 도메인별 classic script. 모든 파일이 전역 스코프를 공유한다.
  - 로드 순서: `common` → `shell` → 도메인 파일들 → `main`(마지막)
  - classic script 사이에는 함수 호이스팅이 되지 않는다. **로드 시점에 다른 파일의 함수를 부르는 코드는 `main.js`에만 둔다.**
  - ES module(`type="module"`)로 바꾸면 전역 참조가 깨진다.
- `dev/assets/` — 로고·파비콘. 웹(frontend)과 같은 파일을 복사해 쓴다.
- `dev/edit.html`, `dev/dict-edit.html` — 팝업. 아직 예전 스타일(인라인)이다.

### 배포 캐시
- `index.html`의 CSS/JS 링크에는 `?v=날짜`가 붙어 있다. **JS/CSS를 바꾸면 이 값을 올린다.** 올리지 않으면 브라우저가 예전 파일을 새 HTML과 섞어 써서 화면이 깨질 수 있다.

## 3) 디자인 토큰 — 모아동 디자인 시스템 기준
`frontend/src/styles/theme`(colors, typography)의 값을 그대로 옮겨 쓴다.

- 폰트: Pretendard (jsdelivr)
- Primary: `#FF5414`(`--primary`), hover `#FF7543`, 옅은 배경 `#FFECE5`
- Gray: `--gray-50` ~ `--gray-900` (colors.gray와 같은 값), 본문 `#111111`
- 상태: 성공 `--success`/`--success-soft`, 위험 `--danger`/`--danger-soft`, 경고 `--warn`/`--warn-soft`
- 태그 색: `.tag-pink | yellow | blue | mint | sky | purple | primary | gray` — 웹 `FEEDBACK_TYPE_META`, `LETTER_CATEGORY_META`와 같은 조합
- 라운드: 입력·버튼 10px, 패널 14px, 섹션 카드 20px
- 페이지 배경 `--gray-100`, 섹션은 흰 카드 + `--shadow-card`

## 4) 레이아웃
- 사이드바는 `.nav-group`(카테고리) 단위로 묶는다. 현재 카테고리: 우체통 / 콘텐츠 / 알림 / 데이터 / 개발.
- 한 메뉴 = 한 `section`. 섹션 첫머리는 `.section-head`(제목 + 우측 버튼) → `.sub`(이 화면에서 무엇을 하는지 한 줄 설명).
- 섹션 안에서 작업 단위는 `.panel`로 나눈다. 긴 폼은 목적별 패널로 쪼갠다.
- 목록 + 상세 편집 화면은 `.letters-layout` / `.feedback-layout`처럼 2열 그리드. 그리드 자식에는 `min-width: 0`이 걸려 있어야 테이블이 칸을 밀지 않는다.
- 선택 전에는 비활성 폼 대신 `.promotion-empty` 안내를 보여준다.
- 긴 편집 폼은 `.sticky-actions`로 저장 버튼을 화면 아래에 붙인다.
- 고급 입력(data JSON 등)은 `<details class="collapsible">`로 접어 둔다.

## 5) 컴포넌트
### 버튼
- 기본: 회색(`--gray-200`) 배경.
- `.btn-primary` — 화면에서 가장 중요한 동작 **하나**에만.
- `.btn-danger` — 삭제, 전체 발송처럼 되돌릴 수 없거나 전체에 영향을 주는 동작.
- `.btn-ghost` — 선택 해제, 취소, 초기화.
- 비동기 처리 중에는 `disabled` + `"처리 중..."`/`"저장 중..."`. 끝나면 원래 문구로 되돌린다(HTML의 문구와 JS의 복구 문구를 같이 바꾼다).

### 피드백
- 전역 알림: `showToast(message, 'success' | 'error')` — 하단 중앙 알약형, 여러 개면 쌓인다(웹 Toast와 같은 모양).
- 인라인 결과: `setMessageBox(id, ok, message)` → `.message-box.success | .error`
- 섹션 배너: `.banner.warn | .banner.error`
- 상태·분류 값은 글자 대신 `createTag(label, tone)` 태그로 보여준다.

### 테이블
- 세로 보더 없음, 행 아래 구분선만. 헤더는 `--gray-700` 13px.
- 선택된 행은 `.is-selected`(primary 옅은 배경).
- 긴 ID는 `.id-cell` 패턴(ellipsis + title tooltip + 클릭 복사) 재사용.

### 편지 미리보기
- `buildLetterPreview(letter, quote)` — 웹 `LetterDetailPage`와 같은 모양. 스타일 수치를 바꾸면 웹 쪽과 함께 맞춘다.
- 마크다운은 `renderLetterMarkdown()`만 쓴다(marked + DOMPurify, raw HTML은 글자 그대로). `innerHTML`에 사용자/운영자 입력을 직접 넣지 않는다.
- 작성/미리보기 전환은 `.segmented` + `bindSegmentedTabs()`.

## 6) 상호작용/구현 컨벤션
### 상태/인증
- 토큰/유저 저장 키는 기존 키 유지: `devPortalToken`, `devPortalUserId` (sessionStorage)
- 로그인 직후 첫 화면은 `DEFAULT_SECTION_ID`(받은 피드백).

### 되돌릴 수 없는 동작
- 전체 사용자에게 나가거나 전체 데이터를 바꾸는 동작은 실행 전에 `confirm`으로 대상·내용을 보여준다.
  - 예: 전체 푸시 발송, 편지 발행, 이미지 변환 배치, 삭제
- 수정 중인 내용이 있는 상태에서 다른 항목을 고르거나 페이지를 떠나면 확인을 받는다(`main.js`의 `beforeunload`에 dirty 판정을 추가).

### API 호출 패턴
- 공통 `headers()`에서 Authorization 헤더를 조립한다.
- `fetch` 후 `readJsonOrEmpty(res)` → `res.ok` 분기 → 403은 개발자 로그인 안내 → `try/catch/finally`로 로딩·버튼 복구.

### 네이밍
- 버튼 id: `btn + 동사/기능` (`btnLoadDict`, `btnSaveSentLetter`)
- 렌더 함수 `render...`, 로드 함수 `load...` / `reload...`, 섹션 진입 로더 `load...IfVisible`

## 7) 새 섹션 추가 체크리스트
- [ ] `index.html`에 `section#<id>`를 추가하고 `.section-head` + `.sub` 설명을 넣었다.
- [ ] 사이드바 알맞은 `.nav-group`에 `<a href="#<id>">`를 추가했다.
- [ ] `shell.js`의 `PORTAL_SECTION_IDS`, `showLogin()`의 hidden 목록, `loadActivePortalSectionData()`에 반영했다.
- [ ] 새 JS 파일이면 `main.js`보다 앞에 `<script src="...?v=...">`로 추가하고 파일 첫 줄에 역할 주석을 달았다.
- [ ] 주요 버튼 하나만 `.btn-primary`, 위험 동작은 `.btn-danger` + `confirm`.
- [ ] 비동기 액션마다 로딩/실패/성공 UI와 버튼 복구 처리를 넣었다.
- [ ] 375px 폭에서 가로 스크롤이 생기지 않는다.
- [ ] `index.html`의 `?v=` 값을 올렸다.

## 8) 접근성/사용성 최소 기준
- 모든 인터랙션 요소에 `:focus-visible` 아웃라인 유지 (`2px solid var(--primary)`).
- `label for`와 입력 `id`를 항상 연결.
- 버튼은 항상 `type="button"` 또는 `type="submit"` 명시.
- 새 창 링크는 `target="_blank"` 시 `rel="noopener"` 포함.
- 클릭 가능한 테이블 행은 `tabIndex=0`, `role="button"`, Enter/Space 처리.
