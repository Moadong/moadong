# 개발자 포털 홍보 게시판 "삭제" 기능 구현 계획

## 결론

현재 기준으로 이 계획은 실제 구현 가능하다.

가장 현실적인 1차 구현은 `홍보 게시글 본문만 삭제`하는 방식이다.

전제는 아래와 같다.

1. 프론트 수정 대상은 주로 `backend/src/main/resources/static/dev/index.html` 이다.
2. 백엔드에 `DELETE /api/promotion/{articleId}` API를 추가해야 한다.
3. 삭제 권한은 기존 생성/수정과 동일하게 `DEVELOPER`로 제한한다.
4. 현재 업로드된 홍보 이미지는 R2에 저장되지만, 이미지 삭제 로직은 아직 보이지 않는다.
5. 따라서 1차 구현에서는 `게시글 삭제`와 `R2 이미지 정리`를 분리하는 것이 안전하다.

위 전제를 수용하면, 운영에 필요한 삭제 기능을 비교적 작은 변경으로 추가할 수 있다.

## 목표

`backend/src/main/resources/static/dev/index.html` 안의 홍보 게시판 관리 섹션에서
현재 가능한 `목록 조회`, `새 글 생성`, `기존 글 수정`, `이미지 업로드`에 더해
`선택된 홍보 게시글 삭제` 기능을 붙인다.

이번 작업의 핵심은 관리자가 개발자 포털에서 잘못 등록된 게시글이나 종료된 홍보 글을 직접 제거할 수 있게 만드는 것이다.

## 현재 코드 기준 확인 사항

프론트 대상 파일:

- `backend/src/main/resources/static/dev/index.html`

백엔드 대상 파일:

- `backend/src/main/java/moadong/club/controller/PromotionArticleController.java`
- `backend/src/main/java/moadong/club/service/PromotionArticleService.java`
- `backend/src/main/java/moadong/club/repository/PromotionArticleRepository.java`

이미 구현된 항목:

- 홍보 게시글 목록 조회
  - `GET /api/promotion`
- 홍보 게시글 생성
  - `POST /api/promotion`
- 홍보 게시글 수정
  - `PUT /api/promotion/{articleId}`
- 홍보 게시글 이미지 업로드
  - `POST /api/promotion/{articleId}/upload`
- 선택된 게시글 편집 상태 관리
- dirty 상태 감지
- 새로고침 / 선택 변경 / 선택 해제 시 confirm 처리
- 404 응답 시 선택 해제 및 목록 정리 패턴 일부 구현

현재 프론트 주요 함수:

- `updatePromotionEditorState`
- `renderPromotionList`
- `reloadPromotionList`
- `clearPromotionSelection`
- `selectPromotionArticle`
- `btnSavePromotion.onclick`
- `btnUploadPromotionImage.onclick`

현재 프론트 주요 상태:

- `promotionArticles`
- `promotionEditorMode`
- `promotionSelectedArticleId`
- `promotionSelectedOriginal`
- `promotionHasLoaded`
- `promotionIsLoading`
- `promotionIsSaving`
- `promotionIsUploading`

현재 백엔드 주요 진입점:

- `PromotionArticleController#getPromotionArticles`
- `PromotionArticleController#createPromotionArticle`
- `PromotionArticleController#updatePromotionArticle`
- `PromotionArticleService#getPromotionArticles`
- `PromotionArticleService#createPromotionArticle`
- `PromotionArticleService#updatePromotionArticle`

## 현재 구조의 한계

지금 홍보 관리 UI는 조회/생성/수정 중심으로 구성되어 있고,
삭제는 UI와 API 모두 아직 없다.

핵심 제약은 아래와 같다.

1. 편집 액션 버튼에 `삭제` 버튼이 없다.
2. 프론트에는 삭제 요청 함수가 없다.
3. 백엔드 컨트롤러에 `DELETE /api/promotion/{articleId}` 매핑이 없다.
4. 서비스 레이어에도 게시글 삭제 메서드가 없다.
5. 이미지 업로드는 존재하지만, 업로드된 파일 정리 책임은 아직 명확하지 않다.

## 핵심 판단

이 기능은 두 단계로 나누어 생각하는 것이 안전하다.

### 1. 1차 구현은 "게시글 삭제"에 집중한다

MongoDB 기준으로 홍보 게시글 문서 삭제는 단순하다.

`articleId`로 존재 여부를 확인한 뒤 삭제하면 된다.

이 방식은 현재 생성/수정 구조와도 잘 맞고,
프론트에서도 저장 로직과 비슷한 패턴으로 처리할 수 있다.

### 2. 이미지 파일 삭제는 별도 작업으로 분리한다

현재 확인된 업로드 로직은 `PromotionImageUploadService`에 있고,
R2 업로드는 수행하지만 삭제는 보이지 않는다.

즉 게시글을 삭제하더라도 아래가 불명확하다.

1. 모든 이미지 URL이 항상 우리 R2 경로인지
2. URL에서 실제 object key를 안정적으로 역산할 수 있는지
3. 일부 파일 삭제 실패 시 게시글 삭제를 롤백할지
4. 외부 URL이 섞여 있는 경우 어떤 정책을 적용할지

이 문제를 한 번에 묶으면 구현 복잡도가 크게 오른다.

따라서 1차는 게시글 데이터 삭제만 지원하고,
이미지 정리는 후속 작업으로 두는 편이 낫다.

## 최종 구현 방향

### 프론트

편집 패널 액션 영역에 `삭제` 버튼을 추가한다.

버튼 배치는 아래 흐름이 적절하다.

- `저장`
- `원본으로 되돌리기`
- `삭제`
- `선택 해제`

동작 정책은 아래와 같다.

1. create 모드에서는 삭제 버튼을 비활성화한다.
2. 아무 게시글도 선택되지 않았으면 비활성화한다.
3. 저장/업로드/목록 로딩 중에는 비활성화한다.
4. 삭제 클릭 시 confirm을 한 번 더 받는다.
5. 삭제 성공 시 목록을 서버 기준으로 다시 동기화한다.
6. 삭제된 게시글이 선택 상태였다면 선택을 해제한다.
7. 성공 메시지와 토스트를 보여준다.

### 백엔드

컨트롤러에 아래 엔드포인트를 추가한다.

- `DELETE /api/promotion/{articleId}`

권한 정책:

- `@PreAuthorize("hasRole('DEVELOPER')")`
- `@SecurityRequirement(name = "BearerAuth")`

서비스에서는 아래 순서로 처리한다.

1. `articleId`로 게시글 존재 여부 확인
2. 없으면 `PROMOTION_ARTICLE_NOT_FOUND` 예외 발생
3. 있으면 repository에서 삭제

Repository는 `MongoRepository`를 이미 상속하고 있으므로
기본 `deleteById`를 그대로 활용할 수 있다.

## 프론트 상세 변경 계획

### 1. 액션 버튼 추가

대상:

- `promotion-actions` 영역

추가 요소:

- `button#btnDeletePromotion`

라벨:

- 기본: `삭제`
- 진행 중: `삭제 중...`

실제 반영 위치:

- `promotion-actions` 내부
- 현재 순서는 `저장 -> 원본으로 되돌리기 -> 선택 해제`
- 여기에 `삭제`를 `원본으로 되돌리기`와 `선택 해제` 사이에 넣는 구성이 가장 자연스럽다

권장 마크업:

```html
<div class="promotion-actions">
  <button type="button" id="btnSavePromotion">저장</button>
  <button type="button" id="btnResetPromotion">원본으로 되돌리기</button>
  <button type="button" id="btnDeletePromotion">삭제</button>
  <button type="button" id="btnClearPromotionSelection">선택 해제</button>
</div>
```

### 2. 상태 제어 확장

대상 함수:

- `updatePromotionEditorState`

추가 상태:

- `promotionIsDeleting`

초기 선언 위치:

- 기존 상태 변수 선언부에서 `promotionIsUploading` 다음에 추가

예상 선언:

```js
let promotionIsDeleting = false;
```

기존 `busy` 계산에 삭제 상태도 포함한다.

즉 아래 모든 동작은 삭제 중 잠겨야 한다.

- 폼 입력
- 저장
- 새 글 작성
- 목록 새로고침
- 이미지 업로드
- 선택 해제

삭제 버튼 활성화 조건:

1. 수정 모드여야 함
2. `promotionSelectedArticleId`가 있어야 함
3. busy 상태가 아니어야 함

`updatePromotionEditorState`에서 실제로 바꿔야 하는 항목:

1. `const btnDelete = document.getElementById('btnDeletePromotion');` 추가
2. `busy` 계산에 `promotionIsDeleting` 포함
3. `btnDelete.disabled = busy || !hasSelection || isCreateMode;`
4. `btnDelete.textContent = promotionIsDeleting ? '삭제 중...' : '삭제';`
5. 이미지 URL preview card의 제거 버튼 disable 조건에도 `promotionIsDeleting` 포함

권장 수정 형태:

```js
const busy = promotionIsLoading || promotionIsSaving || promotionIsUploading || promotionIsDeleting;
const btnDelete = document.getElementById('btnDeletePromotion');

btnDelete.disabled = busy || !hasSelection || isCreateMode;
btnDelete.textContent = promotionIsDeleting ? '삭제 중...' : '삭제';
```

### 3. 삭제 요청 함수 추가

예상 함수:

- `deletePromotionArticleRequest(articleId)`

형태는 기존 아래 함수들과 맞춘다.

- `createPromotionArticleRequest`
- `updatePromotionArticleRequest`
- `uploadPromotionImageRequest`

예상 구현:

- `fetch(API_BASE + '/api/promotion/' + encodeURIComponent(articleId), { method: 'DELETE', headers: headers() })`

권장 구현:

```js
async function deletePromotionArticleRequest(articleId) {
  const res = await fetch(API_BASE + '/api/promotion/' + encodeURIComponent(articleId), {
    method: 'DELETE',
    headers: headers()
  });
  const data = await readJsonOrEmpty(res);
  return { res, data };
}
```

배치 위치:

- `updatePromotionArticleRequest`
- `uploadPromotionImageRequest`

이 두 함수 사이 또는 바로 아래에 두면 관련 API helper가 모여 있어 읽기 쉽다.

### 4. 삭제 버튼 클릭 핸들러 추가

예상 흐름:

1. 선택된 게시글이 없으면 종료
2. dirty 상태이면 삭제 confirm 문구를 조금 더 강하게 표시
3. 사용자 confirm 통과 시 삭제 요청
4. `403`이면 개발자 권한 안내
5. `404`이면 이미 삭제된 것으로 보고 목록에서 제거 후 선택 해제
6. 성공 시 `reloadPromotionList({ keepMessage: true })`
7. 재조회 실패 시에도 삭제 성공 메시지는 유지하고 배너로 경고

추천 confirm 문구:

- 기본: `선택한 홍보 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
- dirty 포함: `저장되지 않은 변경사항이 있습니다. 선택한 홍보 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`

실제 구현 시 권장 순서:

1. `const selectedId = promotionSelectedArticleId;`
2. `const selectedArticle = promotionArticles.find((article) => article.id === selectedId);`
3. 선택 없음이면 `showPromotionSaveResult(false, '삭제할 홍보 게시글을 먼저 선택하세요.')`
4. confirm 문구 생성
5. `promotionIsDeleting = true`
6. `updatePromotionEditorState()`
7. `clearPromotionBanner()`
8. `hidePromotionSaveResult()`
9. `deletePromotionArticleRequest(selectedId)` 호출
10. 응답별 처리
11. finally에서 `promotionIsDeleting = false`

권장 confirm 문구 생성 로직:

```js
const selectedArticle = promotionArticles.find((article) => article.id === promotionSelectedArticleId);
const articleLabel = selectedArticle?.title ? '\"' + selectedArticle.title + '\"' : '선택한 홍보 게시글';
const confirmMessage = isPromotionDirty()
  ? '저장되지 않은 변경사항이 있습니다. ' + articleLabel + '을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
  : articleLabel + '을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.';
```

권장 핸들러 골격:

```js
document.getElementById('btnDeletePromotion').onclick = async () => {
  const selectedId = promotionSelectedArticleId;
  const selectedArticle = promotionArticles.find((article) => article.id === selectedId);

  if (!selectedId || !selectedArticle) {
    showPromotionSaveResult(false, '삭제할 홍보 게시글을 먼저 선택하세요.');
    return;
  }

  const articleLabel = selectedArticle.title ? '\"' + selectedArticle.title + '\"' : '선택한 홍보 게시글';
  const confirmMessage = isPromotionDirty()
    ? '저장되지 않은 변경사항이 있습니다. ' + articleLabel + '을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    : articleLabel + '을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.';

  if (!confirm(confirmMessage)) return;

  promotionIsDeleting = true;
  updatePromotionEditorState();
  clearPromotionBanner();
  hidePromotionSaveResult();

  try {
    const { res, data } = await deletePromotionArticleRequest(selectedId);

    if (res.status === 403) {
      showPromotionSaveResult(false, '개발자 계정으로 로그인하세요.');
      return;
    }

    if (res.status === 404 && data.statuscode === '902-1') {
      promotionArticles = promotionArticles.filter((article) => article.id !== selectedId);
      clearPromotionSelection({ keepMessage: true });
      showPromotionSaveResult(false, data.message || '선택한 홍보 게시글을 찾을 수 없습니다. 목록을 새로고침하세요.');
      return;
    }

    if (!res.ok) {
      showPromotionSaveResult(false, data.message || '홍보 게시글 삭제 실패 (HTTP ' + res.status + ')');
      return;
    }

    const deleteSuccessMessage = getApiSuccessMessage(data, '홍보 게시글이 삭제되었습니다.');
    const syncResult = await reloadPromotionList({ keepMessage: true });
    if (!syncResult.ok) {
      clearPromotionSelection({ keepMessage: true });
      showPromotionSaveResult(true, deleteSuccessMessage);
      setPromotionBanner('삭제는 완료되었지만 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.', 'warn');
      return;
    }

    clearPromotionSelection({ keepMessage: true });
    showPromotionSaveResult(true, deleteSuccessMessage);
    showToast('홍보 게시글 삭제 완료', 'success');
  } catch (e) {
    showPromotionSaveResult(false, e.message || '요청 실패');
  } finally {
    promotionIsDeleting = false;
    updatePromotionEditorState();
  }
};
```

### 5. 삭제 성공 후 UI 처리

가장 단순하고 안정적인 방식은 로컬 배열만 직접 조작하지 않고
성공 후 `reloadPromotionList()`로 서버 기준 최신 상태를 다시 받는 것이다.

단, `404` 응답은 예외적으로 아래처럼 즉시 정리 가능하다.

1. `promotionArticles`에서 해당 항목 제거
2. `clearPromotionSelection({ keepMessage: true })`
3. `showPromotionSaveResult(false, ...)` 또는 배너 표시

이 패턴은 현재 수정/업로드 404 처리와 톤을 맞출 수 있다.

구현 시 주의할 점:

1. `reloadPromotionList()`는 선택된 ID가 없으면 빈 선택 상태로 화면을 갱신할 수 있다.
2. 삭제 성공 후에는 기존 선택이 더 이상 유효하지 않으므로 `selectedArticleId`를 넘기지 않는 편이 안전하다.
3. 따라서 성공 흐름에서는 `reloadPromotionList({ keepMessage: true })` 호출 후 `clearPromotionSelection({ keepMessage: true })`를 한 번 더 보장하는 방식이 안전하다.

## 프론트 실제 수정 포인트 체크리스트

작업자가 바로 옮겨가기 쉽도록 실제 수정 대상 블록을 정리하면 아래와 같다.

1. 상태 변수 선언부
   - `let promotionIsDeleting = false;`
2. 버튼 마크업
   - `promotion-actions` 안에 `btnDeletePromotion` 추가
3. `updatePromotionEditorState`
   - `busy` 계산 확장
   - `btnDeletePromotion` 제어 추가
4. `createPromotionPreviewCard`
   - 제거 버튼 disable 조건에 `promotionIsDeleting` 포함
5. API helper 구간
   - `deletePromotionArticleRequest(articleId)` 추가
6. `clearPromotionState`
   - `promotionIsDeleting = false;` 추가
7. 버튼 이벤트 바인딩 구간
   - `document.getElementById('btnDeletePromotion').onclick = async () => { ... }` 추가

## 백엔드 실제 수정 포인트 체크리스트

## 백엔드 상세 변경 계획

### 1. Controller

대상:

- `PromotionArticleController`

추가 메서드:

- `deletePromotionArticle(@PathVariable String articleId)`

응답 메시지:

- `홍보 게시글이 삭제되었습니다.`

실제 import 변경:

- `org.springframework.web.bind.annotation.DeleteMapping`

권장 메서드 형태:

```java
@DeleteMapping("/{articleId}")
@Operation(summary = "홍보 게시글 삭제", description = "기존 홍보 게시글을 삭제합니다.")
@PreAuthorize("hasRole('DEVELOPER')")
@SecurityRequirement(name = "BearerAuth")
public ResponseEntity<?> deletePromotionArticle(@PathVariable String articleId) {
    promotionArticleService.deletePromotionArticle(articleId);
    return Response.ok("홍보 게시글이 삭제되었습니다.");
}
```

### 2. Service

대상:

- `PromotionArticleService`

추가 메서드:

- `deletePromotionArticle(String articleId)`

예상 구현:

1. `promotionArticleRepository.findById(articleId)` 또는 `existsById(articleId)` 확인
2. 없으면 `PROMOTION_ARTICLE_NOT_FOUND`
3. `promotionArticleRepository.deleteById(articleId)`

구현 단순성을 생각하면 아래 방식이 읽기 쉽다.

1. `findById`
2. `orElseThrow`
3. `deleteById`

권장 구현:

```java
@Transactional
public void deletePromotionArticle(String articleId) {
    promotionArticleRepository.findById(articleId)
        .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));

    promotionArticleRepository.deleteById(articleId);
}
```

추가 판단:

- 현재 서비스는 생성/수정도 `@Transactional`을 사용하고 있으므로 삭제도 맞춰 주는 편이 일관적이다.
- 별도 club 조회는 필요 없다.

### 3. Repository

대상:

- `PromotionArticleRepository`

추가 메서드는 필수 아님.

이미 `MongoRepository` 기본 메서드로 처리 가능하다.

즉 Repository 파일은 수정하지 않아도 된다.

## 백엔드 변경 후 기대 API 계약

### 요청

```http
DELETE /api/promotion/{articleId}
Authorization: Bearer {token}
```

### 성공 응답 예시

```json
{
  "message": "홍보 게시글이 삭제되었습니다."
}
```

### 실패 응답 예시

존재하지 않는 글:

```json
{
  "statuscode": "902-1",
  "message": "홍보 게시글이 존재하지 않습니다."
}
```

## 메시지/예외 처리 계획

삭제 시 고려할 응답은 아래와 같다.

### 403

- 의미: 개발자 권한 없음
- 프론트 처리: `개발자 계정으로 로그인하세요.`

### 404 + `902-1`

- 의미: 대상 게시글 없음
- 프론트 처리:
  - 목록에서 제거
  - 선택 해제
  - `선택한 홍보 게시글을 찾을 수 없습니다. 목록을 새로고침하세요.` 또는 이에 준하는 문구 표시

### 기타 4xx/5xx

- 의미: 삭제 실패
- 프론트 처리:
  - API message 우선
  - 없으면 `홍보 게시글 삭제 실패 (HTTP xxx)`

### 성공 후 목록 재동기화 실패

- 삭제는 완료되었지만 조회 재동기화 실패 가능성은 따로 안내한다.

예시 문구:

- `삭제는 완료되었지만 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.`

## 테스트 계획

### 수동 테스트

1. 목록 조회 후 기존 게시글 선택
2. 삭제 버튼 활성화 확인
3. confirm 취소 시 아무 변화 없는지 확인
4. confirm 승인 시 삭제 성공 메시지와 목록 반영 확인
5. create 모드에서 삭제 버튼 비활성화 확인
6. 저장 중/업로드 중 버튼 잠금 확인
7. 존재하지 않는 글을 다른 세션에서 먼저 지운 뒤 404 처리 확인
8. 개발자 권한이 없을 때 403 메시지 확인

### 백엔드 테스트

가능하면 아래 테스트를 추가한다.

1. 정상 삭제 시 repository delete 호출 검증
2. 존재하지 않는 articleId 삭제 시 `PROMOTION_ARTICLE_NOT_FOUND` 검증

이미 관련 서비스 테스트 클래스가 있다면 그 위치에 맞춰 추가하고,
없다면 이번 작업에서는 수동 검증만 먼저 수행해도 된다.

권장 테스트 시나리오를 더 풀어쓰면 아래와 같다.

1. `deletePromotionArticle` 호출 시 `findById`가 값을 반환하면 `deleteById(articleId)`가 1회 호출된다.
2. `findById`가 비어 있으면 `RestApiException`이 발생하고 `deleteById`는 호출되지 않는다.
3. 컨트롤러 레벨 테스트를 추가할 수 있다면 `DEVELOPER` 권한이 없는 경우 `403`을 검증한다.

## 구현 리스크와 대응

### 1. 삭제 후 선택 상태 꼬임

리스크:

- 삭제 직후 `promotionSelectedArticleId`가 남아 있으면 다음 저장/업로드 로직이 잘못 동작할 수 있다.

대응:

- 성공/404 처리 모두에서 `clearPromotionSelection({ keepMessage: true })`를 호출한다.

### 2. dirty 상태와 삭제 confirm 충돌

리스크:

- 저장되지 않은 변경이 있는데 일반 삭제 confirm만 띄우면 사용자가 무엇을 잃는지 명확하지 않다.

대응:

- `isPromotionDirty()`일 때 별도 confirm 문구를 사용한다.

### 3. 삭제 성공 후 reload 실패

리스크:

- 실제 서버 삭제는 끝났는데 UI가 이전 목록을 계속 보여줄 수 있다.

대응:

- 성공 메시지는 유지하고, 경고 배너로 재조회 실패를 명시한다.
- 가능하면 로컬 배열에서도 우선 해당 항목을 제거한 뒤 reload를 시도하는 방식도 대안이 될 수 있다.
- 다만 1차 구현은 기존 코드 스타일에 맞춰 reload 우선 전략을 유지한다.

## 구현 순서 세분화

바로 작업할 때는 아래 순서가 가장 안전하다.

1. 백엔드 컨트롤러에 `DELETE` 엔드포인트 추가
2. 서비스에 `deletePromotionArticle` 추가
3. 프론트 마크업에 삭제 버튼 추가
4. 프론트 상태 변수에 `promotionIsDeleting` 추가
5. `updatePromotionEditorState`에 버튼/잠금 제어 추가
6. `deletePromotionArticleRequest` helper 추가
7. 삭제 클릭 핸들러 추가
8. `clearPromotionState`에 delete 상태 초기화 추가
9. 수동 테스트

## 구현 완료 기준

아래가 모두 만족되면 1차 구현 완료로 볼 수 있다.

1. 수정 모드에서만 삭제 버튼이 보이고 동작한다.
2. create 모드에서는 삭제 버튼이 비활성화된다.
3. 삭제 confirm 후 실제 게시글이 제거된다.
4. 삭제 후 편집 폼이 비워지고 선택 상태가 사라진다.
5. 403, 404, 일반 실패가 각각 의도한 메시지로 처리된다.
6. 삭제 중에는 저장/업로드/새로고침/입력이 잠긴다.

## 후속 과제

이번 삭제 기능 이후 별도로 검토할 항목:

1. 게시글 삭제 시 R2 이미지도 함께 지울지 여부
2. 외부 URL 이미지와 내부 업로드 이미지를 구분하는 정책
3. 삭제 전 이미지 개수, 제목, 동아리명을 보여주는 더 강한 확인 모달
4. 다중 선택 삭제 또는 목록 행 단위 빠른 삭제 버튼 추가 여부

## 권장 구현 순서

1. 백엔드 `DELETE /api/promotion/{articleId}` 추가
2. 프론트 `btnDeletePromotion` 및 `promotionIsDeleting` 상태 추가
3. 삭제 요청 함수 및 클릭 핸들러 구현
4. 403/404/재동기화 실패 메시지 처리 연결
5. 수동 테스트

## 최종 판단

이 삭제 기능은 현재 구조에서 무리 없이 추가 가능하다.

다만 "게시글 삭제"와 "업로드 파일 정리"는 같은 문제로 묶지 않는 것이 중요하다.

이번 작업의 적정 범위는 아래다.

1. 개발자 포털에서 선택된 홍보 게시글 삭제
2. 삭제 성공 후 목록/선택 상태 정리
3. 권한 및 존재하지 않는 대상에 대한 예외 처리

반면 아래는 후속 작업으로 분리하는 편이 안전하다.

1. R2 이미지 동시 삭제
2. 삭제 실패 보상 트랜잭션 설계
3. 스토리지 정리 배치
