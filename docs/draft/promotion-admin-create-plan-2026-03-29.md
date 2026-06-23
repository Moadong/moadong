# 개발자 포털 홍보 게시판 "추가" 기능 구현 계획

## 결론

현재 기준으로 이 계획은 실제 구현 가능하다.

단, 전제는 명확하다.

1. 주 수정 대상은 `backend/src/main/resources/static/dev/index.html` 한 파일이다.
2. 백엔드 API는 기존 `POST /api/promotion`, `PUT /api/promotion/{articleId}`, `POST /api/promotion/{articleId}/upload`를 그대로 사용한다.
3. 생성 모드에서는 `clubId`를 자동으로 알 수 없으므로, 생성 시에만 `clubId` 입력을 허용해야 한다.
4. 생성 API가 `images`를 필수로 요구할 가능성이 있으므로, 최초 생성 시에는 이미지 URL textarea 입력 방식이 기본이고, 직접 업로드는 생성 성공 후에만 허용한다.

위 4가지를 수용하면 `index.html`만 수정해서 "홍보물 추가"를 구현할 수 있다.

## 목표

`backend/src/main/resources/static/dev/index.html` 안의 홍보 게시판 관리 섹션에서
현재 가능한 `목록 조회`, `기존 게시글 선택`, `수정 저장`, `이미지 업로드`에 더해
`새 홍보 게시글 작성 및 생성` 기능을 붙인다.

이번 작업은 리액트 관리자 페이지를 만드는 일이 아니며,
정적 개발자 포털 안의 기존 홍보 편집기를 확장하는 작업이다.

## 현재 코드 기준 확인 사항

대상 파일:

- `backend/src/main/resources/static/dev/index.html`

이미 구현된 항목:

- 홍보 게시글 목록 로드 버튼
- 목록 테이블 렌더링
- 게시글 선택 상태 관리
- 선택된 게시글 폼 채우기
- 수정 저장
  - `PUT /api/promotion/{articleId}`
- 이미지 직접 업로드
  - `POST /api/promotion/{articleId}/upload`
- 이미지 URL textarea 기반 미리보기/삭제
- 변경사항 감지
- 선택 해제 / 원복 / 새로고침 시 confirm 처리

현재 실제 함수명:

- `promotionArticleToFormState`
- `getPromotionCurrentFormState`
- `fillPromotionForm`
- `isPromotionDirty`
- `updatePromotionEditorState`
- `renderPromotionList`
- `clearPromotionSelection`
- `selectPromotionArticle`
- `normalizePromotionPayload`
- `btnSavePromotion.onclick`
- `btnUploadPromotionImage.onclick`

현재 실제 상태 변수:

- `promotionArticles`
- `promotionSelectedArticleId`
- `promotionSelectedOriginal`
- `promotionHasLoaded`
- `promotionIsLoading`
- `promotionIsSaving`
- `promotionIsUploading`

## 현재 구조의 한계

지금 홍보 관리 UI는 사실상 "기존 글 수정기"로 설계되어 있다.

핵심 제약은 아래와 같다.

1. 저장 로직이 `promotionSelectedArticleId`가 있어야만 동작한다.
2. 이미지 업로드도 `promotionSelectedArticleId`가 있어야만 동작한다.
3. `clubId` input은 읽기 전용이고, 선택된 게시글에서만 값이 채워진다.
4. 따라서 새 게시글 작성에 필요한 `빈 폼 상태`, `생성 모드`, `POST /api/promotion` 호출 분기가 없다.

## 가장 중요한 보완점

이 문서를 구현 착수용으로 만들기 위해 가장 크게 수정한 판단은 아래다.

### 1. `clubId` 자동 주입 가정 제거

이전 초안에서는 "현재 로그인 사용자 기준 clubId 자동 채움"을 가정했지만,
`index.html` 안에는 홍보 생성용 기본 `clubId`를 확보하는 상태가 없다.

현재 페이지에서 확인되는 사실:

- `promotionClubId`는 읽기 전용이다.
- 값은 선택된 게시글을 폼에 채울 때만 들어간다.
- 로그인 정보는 `userId`만 `sessionStorage`에 저장한다.
- 홍보 생성용 현재 동아리 선택 상태는 없다.

즉 생성 기능을 실제로 구현하려면 다음 둘 중 하나가 필요하다.

1. 생성 모드에서만 `clubId`를 직접 입력 가능하게 만든다.
2. 생성 모드에서 사용할 동아리 선택 UI를 추가한다.

이번 작업에서는 1번이 최소 변경으로 가장 현실적이다.

### 2. `selectPromotionArticleById` 표기 수정

기존 문서의 함수명 하나가 실제 코드와 달랐다.
실제 함수명은 `selectPromotionArticle` 이다.

### 3. "index.html만 수정" 전제에 맞는 생성 정책 확정

백엔드 변경 없이 진행하려면 아래 정책이 필요하다.

- 새 글은 `POST /api/promotion`으로 생성
- 생성 전 직접 업로드는 불가
- 생성 시 필요한 이미지는 textarea에 URL로 직접 넣음
- 생성 성공 후 자동 선택된 상태에서만 직접 업로드 허용

이 정책이면 백엔드나 리액트 관리자 없이도 흐름이 닫힌다.

## 최종 구현 방향

홍보 편집기를 아래 두 모드로 나눈다.

- `edit` 모드: 기존 게시글 선택 후 수정
- `create` 모드: 빈 폼으로 새 게시글 생성

현재 구조는 `edit`만 존재하므로, 여기에 `create`를 추가하는 방식으로 구현한다.

## 상태 설계

추가할 상태:

- `let promotionEditorMode = 'edit';`
  - 값: `'edit' | 'create'`

추가하지 않아도 되는 상태:

- 별도 `promotionCreateDraftState`

이유:

- 현재 구조상 `promotionSelectedOriginal`을 create 모드의 "초기값"으로도 재사용할 수 있다.
- 생성 모드 진입 시 빈 초기 폼을 `promotionSelectedOriginal`로 넣으면,
  기존 `isPromotionDirty()`와 `btnResetPromotion` 흐름을 거의 그대로 사용할 수 있다.

즉 최소 변경안은 아래다.

- `promotionSelectedOriginal`
  - edit 모드: 선택된 글의 원본
  - create 모드: 신규 작성 초기값

## 마크업 변경 명세

수정 대상:

- `backend/src/main/resources/static/dev/index.html`

### 1. 헤더 액션에 버튼 추가

현재:

- `btnLoadPromotion`

추가:

- `btnCreatePromotion`

권장 배치:

- `목록 새로고침`
- `새 게시글 작성`

### 2. 편집 패널 제목/요약은 동적 문구로 유지

현재:

- `선택된 게시글 편집`
- `왼쪽 목록에서 수정할 게시글을 선택하세요.`

변경:

- 제목은 그대로 두어도 되지만,
  `promotionSelectionSummary`와 `promotionEditingBadge`에서 모드를 더 명확히 표시한다.

예시:

- edit + 미선택: `왼쪽 목록에서 수정할 게시글을 선택하세요.`
- edit + 선택됨: `선택한 게시글을 수정 중입니다.`
- create: `새 홍보 게시글을 작성 중입니다.`

### 3. `promotionClubId` 필드 정책 변경

현재:

- 항상 `readonly`

변경:

- edit 모드: `readonly = true`
- create 모드: `readonly = false`

즉 마크업 자체는 유지하고,
`updatePromotionEditorState()`에서 속성만 토글한다.

이 방식이 가장 작고 구현 가능성이 높다.

### 4. 도움말 문구 변경

현재 도움말:

- `clubId`는 1차 구현에서 읽기 전용입니다...

변경 필요:

- edit 모드: `기존 게시글의 clubId는 읽기 전용입니다.`
- create 모드: `새 게시글 생성 시에는 clubId를 직접 입력하세요. 직접 업로드는 저장 후 사용할 수 있습니다.`

## 함수 단위 상세 변경 계획

## 1. `getEmptyPromotionFormState()` 추가

신규 함수:

```js
function getEmptyPromotionFormState() {
  return {
    clubId: '',
    title: '',
    location: '',
    eventStartDate: '',
    eventEndDate: '',
    description: '',
    imagesText: ''
  };
}
```

역할:

- create 모드 진입 시 폼 초기값 제공
- clear/reset 기준점 제공

## 2. `enterPromotionCreateMode()` 추가

신규 함수 역할:

1. 현재 dirty 상태면 confirm
2. `promotionEditorMode = 'create'`
3. `promotionSelectedArticleId = ''`
4. `promotionSelectedOriginal = getEmptyPromotionFormState()`
5. `fillPromotionForm(promotionSelectedOriginal)`
6. 저장 결과 메시지 숨김
7. 에디터 UI 갱신
8. 목록 강조 제거

구현 포인트:

- 목록 자체는 유지
- 다만 선택 강조는 제거됨
- `renderPromotionList()`와 `updatePromotionEditorState()` 호출

## 3. `leavePromotionCreateMode()` 추가

신규 함수 역할:

1. `promotionEditorMode = 'edit'`
2. `promotionSelectedOriginal = null` 또는 현재 선택 글 기준으로 재설정
3. 선택된 글이 없으면 빈 읽기 전용 상태로 복귀
4. UI 갱신

주의:

- 실제 구현에서는 별도 함수 없이 `clearPromotionSelection()` 안에 합쳐도 되지만,
  문서 기준으로는 create 모드 종료 책임을 분리하는 편이 안전하다.

## 4. `clearPromotionSelection(options)` 수정

현재 역할:

- 선택 해제
- 폼 초기화
- 메시지 정리
- 목록 다시 렌더

변경:

- 항상 `promotionEditorMode = 'edit'`로 되돌린다.
- `promotionSelectedArticleId = ''`
- `promotionSelectedOriginal = null`
- `fillPromotionForm(null)`

즉 create 모드에서 `선택 해제`를 누르면
"create 모드 종료 + 빈 읽기 전용 상태"로 돌아가야 한다.

## 5. `selectPromotionArticle(articleId, options)` 수정

현재는 기존 글 선택만 처리한다.

추가할 동작:

- create 모드에서 다른 글을 선택하려 할 때도 dirty confirm 적용
- 선택 성공 시 `promotionEditorMode = 'edit'`

즉 실제 분기는 아래와 같다.

1. create 모드든 edit 모드든 dirty면 confirm
2. 선택 성공 시 edit 모드 진입
3. `promotionSelectedOriginal = promotionArticleToFormState(next)`
4. 폼 채움
5. UI 갱신

## 6. `normalizePromotionPayload()` 책임 축소

현재 문제:

- 이 함수가 payload 생성과 "선택된 articleId 검증"을 같이 한다.

변경 목표:

- 이 함수는 순수하게 폼 값을 읽고 payload를 만들기만 한다.

남길 검증:

- `clubId`, `title`, `location`, `eventStartDate`, `eventEndDate`, `description` 필수
- `images` 최소 1개
- 날짜 유효성
- 시작 <= 종료

제거할 검증:

- `if (!promotionSelectedArticleId) throw ...`

## 7. 저장 로직 분리

현재 `btnSavePromotion.onclick`는 수정 전용으로 길게 들어가 있다.

실구현 가능성을 높이려면 내부를 아래 함수들로 쪼개는 게 좋다.

- `saveExistingPromotion(articleId, payload)`
- `createPromotion(payload)`
- `reloadPromotionList()`
- `reloadPromotionListAndSelect(articleId)`
- `findCreatedPromotionId(payload, articles)`

### `saveExistingPromotion(articleId, payload)`

- `PUT /api/promotion/{articleId}`
- 성공 시 목록 재조회 후 동일 ID 재선택

### `createPromotion(payload)`

- `POST /api/promotion`
- 성공 시 목록 재조회
- 새로 생성된 글 자동 선택
- 선택 완료 후 `promotionEditorMode = 'edit'`

### `reloadPromotionList()`

- 현재 `btnLoadPromotion.onclick` 안의 목록 조회 fetch를 함수로 추출
- 버튼 클릭 핸들러와 저장 후 동기화 둘 다 재사용

### `reloadPromotionListAndSelect(articleId)`

- 목록 재조회
- `articleId`가 있으면 그 ID 선택
- 없으면 선택 해제

### `findCreatedPromotionId(payload, articles)`

백엔드 응답에서 ID를 못 받는 경우 대비 함수.

우선순위:

1. 생성 응답에 `data.id` 또는 `data.articleId`가 있으면 사용
2. 없으면 목록에서 아래 조건으로 탐색
   - `clubId === payload.clubId`
   - `title === payload.title`
   - `location === payload.location`
3. 여러 개면 가장 최근 것으로 추정

가장 최근 판정 기준:

- `createdAt`이 있으면 내림차순
- 없으면 목록의 마지막 항목 우선

주의:

- 이 추정은 100% 안전하지 않다.
- 따라서 문서에는 "생성 응답에 ID가 없는 경우의 차선책"으로만 기록한다.

## 8. `btnSavePromotion.onclick` 최종 분기

최종 구조:

1. `normalizePromotionPayload()` 호출
2. `promotionEditorMode` 확인
3. edit 모드
   - `promotionSelectedArticleId` 없으면 에러
   - `saveExistingPromotion(promotionSelectedArticleId, payload)`
4. create 모드
   - `createPromotion(payload)`

즉 "선택된 ID 필요" 검증은 이제 저장 분기에서만 한다.

## 9. `updatePromotionEditorState()` 상세 조정

이 함수는 이번 작업의 핵심이다.

반영해야 할 상태:

- `promotionIsLoading`
- `promotionIsSaving`
- `promotionIsUploading`
- `promotionSelectedArticleId`
- `promotionSelectedOriginal`
- `promotionEditorMode`

### edit 모드 + 미선택

- 대부분 입력 disabled
- `promotionClubId` readonly + disabled
- 저장 버튼 disabled
- 원복 버튼 disabled
- 업로드 버튼 disabled
- 요약: `왼쪽 목록에서 수정할 게시글을 선택하세요.`

### edit 모드 + 선택됨

- 일반 입력 enabled
- `promotionClubId` readonly + enabled 표시 또는 disabled 유지
- 저장 버튼 enabled
- 원복 버튼 enabled
- 업로드 버튼 enabled
- 요약: `선택한 게시글을 수정 중입니다.`

### create 모드

- 일반 입력 enabled
- `promotionClubId` editable
- 저장 버튼 enabled
- 원복 버튼 enabled
- 업로드 버튼 disabled
- 저장 버튼 텍스트: `생성`
- 배지: `새 게시글 작성 중`
- 도움말: `생성 후 이미지 직접 업로드 가능`

추가 권장:

- `btnClearPromotionSelection` 텍스트는 그대로 `선택 해제`로 둬도 되지만,
  create 모드에서도 의미가 통하도록 유지한다.

## 10. 이미지 관련 함수 조정

현재 `createPromotionPreviewCard()` 내부 제거 버튼은
`!promotionSelectedArticleId`일 때 비활성화된다.

이 상태는 create 모드에서 문제를 만든다.

이유:

- create 모드에서는 아직 `articleId`가 없지만
- textarea에 직접 넣은 이미지 URL은 제거할 수 있어야 한다.

따라서 제거 버튼 disable 조건은 아래처럼 바뀌어야 한다.

- busy 상태면 disabled
- edit 모드 미선택이면 disabled
- create 모드에서는 enabled

즉 `promotionSelectedArticleId` 존재 여부만으로 막으면 안 된다.

## 11. `btnUploadPromotionImage.onclick` 정책

최종 정책:

- create 모드에서는 업로드 차단
- 메시지: `새 게시글은 먼저 생성한 뒤 이미지를 직접 업로드할 수 있습니다.`
- edit 모드 + 선택됨에서만 허용

이렇게 해야 현재 업로드 API의 `articleId` 요구사항과 정확히 맞는다.

## 12. 목록 새로고침 버튼 처리

현재 `btnLoadPromotion.onclick` 안에는
dirty confirm, fetch, 선택 유지, 배너 처리 로직이 섞여 있다.

보강 방향:

- 버튼 클릭 핸들러는 confirm만 담당
- 실제 fetch는 `reloadPromotionList(options)`로 분리

권장 시그니처:

```js
async function reloadPromotionList(options = {}) {
  // options.selectedArticleId
  // options.keepSelection
  // options.keepMessage
}
```

이렇게 하면 아래 3군데에서 재사용할 수 있다.

- 수동 새로고침
- 수정 저장 후 동기화
- 생성 저장 후 자동 선택

## 세부 구현 순서

1. 홍보 섹션 헤더에 `btnCreatePromotion` 추가
2. 상태 변수 선언부에 `promotionEditorMode` 추가
3. `getEmptyPromotionFormState()` 추가
4. `enterPromotionCreateMode()` 추가
5. `leavePromotionCreateMode()` 또는 `clearPromotionSelection()` 내 create 종료 처리 추가
6. `updatePromotionEditorState()`를 모드 기반으로 전면 보강
7. `normalizePromotionPayload()`에서 articleId 의존 제거
8. 목록 fetch 로직을 `reloadPromotionList()` 계열 함수로 추출
9. `btnSavePromotion.onclick`를 `create/edit` 분기 구조로 변경
10. 생성 성공 후 목록 재조회 및 자동 선택 로직 추가
11. `createPromotionPreviewCard()` 제거 버튼 비활성 조건 수정
12. `btnUploadPromotionImage.onclick`에 create 모드 차단 문구 반영
13. 도움말/요약/배지 문구를 모드 기반으로 정리

## 구현 시 의사코드

```js
let promotionEditorMode = 'edit';

function getEmptyPromotionFormState() {
  return {
    clubId: '',
    title: '',
    location: '',
    eventStartDate: '',
    eventEndDate: '',
    description: '',
    imagesText: ''
  };
}

function enterPromotionCreateMode() {
  if (isPromotionDirty() && !confirm('현재 수정 중인 내용이 사라집니다. 계속할까요?')) return;
  promotionEditorMode = 'create';
  promotionSelectedArticleId = '';
  promotionSelectedOriginal = getEmptyPromotionFormState();
  fillPromotionForm(promotionSelectedOriginal);
  hidePromotionSaveResult();
  renderPromotionList();
  updatePromotionEditorState();
}

function normalizePromotionPayload() {
  const form = getPromotionCurrentFormState();
  // 필수값/날짜/images 검증
  return payload;
}

async function createPromotion(payload) {
  const res = await fetch(API_BASE + '/api/promotion', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload)
  });
  const data = await readJsonOrEmpty(res);
  if (!res.ok) throw new Error(data.message || '홍보 게시글 생성 실패');

  await reloadPromotionList();
  const createdId = data.data?.articleId || data.data?.id || findCreatedPromotionId(payload, promotionArticles);
  if (createdId) {
    selectPromotionArticle(createdId, { skipConfirm: true });
  } else {
    clearPromotionSelection({ keepMessage: true });
  }
  promotionEditorMode = 'edit';
  updatePromotionEditorState();
}

document.getElementById('btnSavePromotion').onclick = async () => {
  const payload = normalizePromotionPayload();
  if (promotionEditorMode === 'create') {
    await createPromotion(payload);
    return;
  }
  if (!promotionSelectedArticleId) {
    showPromotionSaveResult(false, '수정할 홍보 게시글을 먼저 선택하세요.');
    return;
  }
  await saveExistingPromotion(promotionSelectedArticleId, payload);
};
```

## 테스트 시나리오

### 정상 시나리오

1. 로그인 후 홍보 목록 로드
2. `새 게시글 작성` 클릭
3. 목록 선택 강조가 해제되고 create 모드 배지 표시 확인
4. `clubId`, 제목, 장소, 일정, 설명, 이미지 URL 입력
5. `생성` 클릭
6. `POST /api/promotion` 호출 확인
7. 성공 후 목록 재조회 확인
8. 방금 생성한 글 자동 선택 확인
9. 저장 버튼 텍스트가 다시 `저장`으로 돌아오는지 확인
10. 이미지 직접 업로드 버튼 활성화 확인
11. 업로드 후 textarea/미리보기에 이미지가 추가되는지 확인
12. 다시 `저장` 클릭 시 `PUT`으로 수정되는지 확인

### 예외 시나리오

1. create 모드에서 `clubId` 비어 있을 때 저장 차단
2. create 모드에서 필수값 누락 시 저장 차단
3. create 모드에서 이미지 URL 없이 저장 시 차단
4. create 모드에서 직접 업로드 클릭 시 차단 메시지 노출
5. 수정 중 `새 게시글 작성` 클릭 시 confirm 동작
6. create 모드에서 기존 글 선택 시 confirm 동작
7. create 모드에서 `선택 해제` 클릭 시 create 모드 종료 확인
8. 생성 후 목록 재조회 실패 시 에러 배너 노출
9. 생성 응답에 ID가 없을 때 추정 선택 로직이 동작하는지 확인

## 리스크와 대응

### 리스크 1. 생성 응답에 새 게시글 ID가 없을 수 있음

대응:

- 1차는 목록 재조회 후 payload 기반 추정 선택
- 가능하면 후속 개선으로 생성 응답에 ID 포함 검토

### 리스크 2. 생성 API가 이미지 배열을 필수로 요구할 수 있음

대응:

- 1차 생성은 textarea 이미지 URL 입력을 기본 경로로 둔다
- 직접 업로드는 생성 후에만 허용한다

### 리스크 3. create 모드에서 `clubId`를 사용자가 잘못 입력할 수 있음

대응:

- 1차는 수동 입력 허용
- 도움말에 "관리 대상 동아리 ID를 정확히 입력" 문구 추가
- 후속 개선으로 동아리 선택 드롭다운 연동 검토 가능

### 리스크 4. 목록 재조회 로직이 여러 곳에 중복될 수 있음

대응:

- fetch 로직을 `reloadPromotionList()` 계열 함수로 추출

## 착수 전 최종 판단

현재 문서는 아래 이유로 구현 착수 가능 수준이다.

1. 수정 대상 파일이 `index.html` 한 곳으로 고정되어 있다.
2. 실제 함수명과 실제 상태 변수명을 기준으로 변경 포인트가 정리되어 있다.
3. 가장 큰 불확실성이던 `clubId` 문제에 대해 "create 모드에서만 editable"이라는 구현 가능한 결정을 내렸다.
4. 이미지 업로드 제약도 현재 백엔드 API 계약에 맞게 닫힌 흐름으로 정리했다.
5. `POST/PUT` 분기, 재조회, 자동 선택, dirty confirm까지 함수 단위로 쪼개어 설명했다.

즉 이 문서를 기준으로 하면,
"무엇을 어디에 어떻게 붙일지"가 구현자 입장에서 충분히 구체적이다.
