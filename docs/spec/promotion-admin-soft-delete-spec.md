# 홍보 게시글 소프트 딜리트 스펙

## 목적

홍보 게시글 삭제 시 Mongo 문서를 물리 삭제하지 않고,
삭제 상태만 기록하는 소프트 딜리트 정책을 적용한다.

## 핵심 원칙

`삭제된 게시글은 DB에는 남아 있지만, 운영 로직에서는 존재하지 않는 것처럼 취급한다.`

## 데이터 스펙

대상 엔티티:

- `backend/src/main/java/moadong/club/entity/PromotionArticle.java`

### 필드

- `deleted: boolean`
- `deletedAt: Instant`

### 기본값

- 신규 생성 시 `deleted = false`
- 신규 생성 시 `deletedAt = null`

### 삭제 처리

삭제 시 아래 상태로 바뀐다.

- `deleted = true`
- `deletedAt = Instant.now()`

## Repository 스펙

대상 파일:

- `backend/src/main/java/moadong/club/repository/PromotionArticleRepository.java`

### active 기준

active 게시글은 아래 조건을 만족하는 게시글이다.

- `deleted != true`

즉 아래 두 경우를 모두 active로 본다.

1. `deleted = false`
2. `deleted` 필드가 아예 없음

### 이유

기존 운영 데이터에는 `deleted` 필드가 없을 수 있다.

따라서 단순 `deleted = false` 쿼리를 쓰면
기존 정상 게시글이 목록에서 누락될 수 있다.

### active 전용 조회 메서드

- 목록 조회: `findAllActiveOrderByCreatedAtDesc()`
- 단건 조회: `findActiveById(String id)`
- 존재 확인: `existsActiveById(String id)`

## 서비스 스펙

대상 파일:

- `backend/src/main/java/moadong/club/service/PromotionArticleService.java`
- `backend/src/main/java/moadong/media/service/PromotionImageUploadService.java`

### 목록 조회

`GET /api/promotion`은 active 게시글만 반환한다.

삭제된 게시글은 DTO로 내려가지 않는다.

### 수정

삭제된 게시글은 수정할 수 없다.

처리 기준:

- `findActiveById(articleId)`로 조회
- 없으면 `PROMOTION_ARTICLE_NOT_FOUND`

### 삭제

삭제 API는 물리 삭제를 수행하지 않는다.

처리 순서:

1. `findActiveById(articleId)`로 조회
2. 없으면 `PROMOTION_ARTICLE_NOT_FOUND`
3. `softDelete()` 호출
4. `save(article)` 호출

### 이미지 업로드

삭제된 게시글에는 이미지 업로드가 불가능해야 한다.

처리 기준:

- `existsActiveById(articleId)`로 존재 확인
- active가 아니면 `PROMOTION_ARTICLE_NOT_FOUND`

## API 계약 스펙

외부 API 형태는 유지한다.

- `GET /api/promotion`
- `POST /api/promotion`
- `PUT /api/promotion/{articleId}`
- `DELETE /api/promotion/{articleId}`
- `POST /api/promotion/{articleId}/upload`

달라지는 것은 내부 동작이다.

### 의미 변화

- `DELETE`는 하드 딜리트가 아니라 소프트 딜리트다.
- 삭제된 게시글에 대한 `PUT`과 `upload`는 사실상 `404`처럼 동작한다.

## 프론트 영향 스펙

대상 파일:

- `backend/src/main/resources/static/dev/index.html`

프론트는 삭제 UX를 그대로 유지한다.

백엔드가 active 기준 목록만 내려주므로,
삭제 후 목록에서 사라지는 기존 UX가 그대로 유지된다.

추가적인 삭제 상태 표시 UI는 현재 범위에 포함하지 않는다.

## 비범위

아래 항목은 현재 스펙 범위에 포함하지 않는다.

1. 휴지통 목록 조회
2. 삭제된 게시글 복구
3. `deletedBy` 저장
4. 소프트 딜리트 시 R2 이미지 즉시 삭제
5. 일정 기간 지난 soft-deleted 데이터의 정리 배치

## 배포 전 검증 기준

아래 조건이 모두 만족되면 배포 가능하다.

1. 삭제 API 호출 후 Mongo 문서는 남아 있다.
2. 삭제된 문서는 `deleted = true`, `deletedAt != null`이다.
3. 기본 목록 조회에서는 삭제된 게시글이 보이지 않는다.
4. 삭제된 게시글은 수정할 수 없다.
5. 삭제된 게시글에는 이미지 업로드가 불가능하다.
6. 기존 `deleted` 필드가 없는 문서도 정상 목록에 노출된다.
