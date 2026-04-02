# 개발자 포털 홍보 게시판 "소프트 딜리트 전환" 구현 계획

## 결론

현재 구현된 홍보 게시글 삭제 기능은 하드 딜리트 방식이다.

이를 소프트 딜리트로 전환하는 것은 충분히 가능하지만,
단순히 `deleteById`를 `deleted=true`로 바꾸는 정도로 끝나지 않는다.

안전하게 전환하려면 아래 4가지를 함께 맞춰야 한다.

1. `PromotionArticle` 엔티티에 삭제 상태 필드를 추가한다.
2. 목록 조회가 삭제된 게시글을 기본적으로 숨기게 바뀌어야 한다.
3. 수정 및 이미지 업로드가 삭제된 게시글에는 동작하지 않게 막아야 한다.
4. 기존 하드 딜리트 기반 테스트를 소프트 딜리트 기준으로 바꿔야 한다.

위 범위를 함께 처리하면 운영상 복구 가능성을 확보하면서도
현재 개발자 포털 UX는 거의 유지할 수 있다.

## 목표

현재 구현된 `홍보 게시글 삭제` 기능을
물리 삭제가 아닌 `소프트 딜리트` 방식으로 전환한다.

이번 전환의 목표는 다음과 같다.

1. 관리자가 게시글을 삭제하면 실제 Mongo 문서는 남긴다.
2. 일반 목록 조회에서는 삭제된 게시글을 보이지 않게 한다.
3. 삭제된 게시글은 수정 및 이미지 업로드 대상에서 제외한다.
4. 필요 시 향후 복구 기능을 붙일 수 있는 데이터 구조를 만든다.

## 현재 코드 기준 확인 사항

대상 파일:

- `backend/src/main/java/moadong/club/entity/PromotionArticle.java`
- `backend/src/main/java/moadong/club/repository/PromotionArticleRepository.java`
- `backend/src/main/java/moadong/club/service/PromotionArticleService.java`
- `backend/src/main/java/moadong/club/controller/PromotionArticleController.java`
- `backend/src/main/java/moadong/club/payload/dto/PromotionArticleDto.java`
- `backend/src/main/java/moadong/media/service/PromotionImageUploadService.java`
- `backend/src/main/resources/static/dev/index.html`
- `backend/src/test/java/moadong/club/service/PromotionArticleServiceTest.java`
- `backend/src/test/java/moadong/club/controller/PromotionArticleControllerTest.java`

현재 동작 요약:

1. 목록 조회는 `PromotionArticleRepository.findAllByOrderByCreatedAtDesc()`를 사용한다.
2. 삭제는 `deleteById(articleId)`로 물리 삭제한다.
3. 수정은 `findById(articleId)` 후 저장한다.
4. 이미지 업로드는 `existsById(articleId)`만 확인하고 업로드를 허용한다.
5. 프론트는 목록에 없는 게시글은 사실상 존재하지 않는 것으로 본다.

즉 현재 구조는 "존재하면 수정/업로드 가능, 삭제하면 DB에서 사라짐" 전제에 맞춰져 있다.

## 왜 소프트 딜리트가 필요한가

소프트 딜리트로 전환하면 아래 장점이 있다.

1. 운영자가 실수로 삭제한 게시글을 복구할 여지가 생긴다.
2. 삭제 이력과 삭제 시점을 보존할 수 있다.
3. 업로드된 이미지와 게시글 기록의 관계를 운영적으로 추적하기 쉬워진다.
4. 향후 `휴지통`, `복구`, `완전 삭제` 같은 기능 확장이 가능해진다.

반면 단점도 명확하다.

1. 모든 조회 경로에서 삭제된 데이터를 빠뜨리지 않고 제외해야 한다.
2. `findById` 기반 로직이 그대로 남으면 삭제된 글도 수정/업로드될 수 있다.
3. 테스트와 운영 쿼리 기준이 함께 바뀐다.

## 최종 설계 방향

이번 전환에서는 아래 방식이 가장 현실적이다.

### 1. 엔티티에 삭제 상태 필드 추가

`PromotionArticle`에 아래 필드를 추가한다.

- `deleted: boolean`
- `deletedAt: Instant`

선택적으로 나중에 붙일 수 있는 필드:

- `deletedBy: String`

이번 단계에서는 프론트와 API에 삭제 주체 정보가 없으므로
`deletedBy`까지 억지로 넣지 않는 것이 현실적이다.

### 2. 삭제는 상태 변경으로 처리

기존:

- `promotionArticleRepository.deleteById(articleId)`

변경 후:

- 게시글 조회
- 이미 삭제된 상태인지 확인
- `deleted = true`
- `deletedAt = Instant.now()`
- 저장

### 3. 기본 목록 조회는 삭제되지 않은 게시글만 반환

현재 개발자 포털과 일반 API 소비자 관점에서는
"삭제된 글은 보이지 않는다"가 기존 기대와 가장 잘 맞는다.

따라서 `GET /api/promotion`은 기본적으로 `deleted=false`만 내려준다.

### 4. 삭제된 게시글은 수정/업로드 불가

소프트 딜리트에서 제일 중요한 규칙이다.

삭제된 문서가 DB에 남아 있어도,
운영상으로는 "없다"고 취급하는 편이 안전하다.

따라서 아래 동작은 삭제된 게시글에 대해 모두 막는다.

1. 수정
2. 이미지 업로드
3. 향후 상세 조회가 생기면 그 상세 조회도 기본적으로 차단

차단 시 응답은 새 에러 코드를 추가하기보다,
현재 프론트 호환성을 위해 `PROMOTION_ARTICLE_NOT_FOUND`를 재사용하는 것이 현실적이다.

## 엔티티 변경 계획

대상:

- `PromotionArticle`

추가 필드:

```java
@Builder.Default
private boolean deleted = false;

private Instant deletedAt;
```

추가 메서드 권장:

```java
public void softDelete() {
    this.deleted = true;
    this.deletedAt = Instant.now();
}
```

선택적으로 아래 헬퍼도 고려 가능:

```java
public boolean isDeleted() {
    return deleted;
}
```

### 주의할 점

`@Builder.Default`를 넣지 않으면
기존 빌더 기반 생성 코드에서 `deleted=false`가 누락될 수 있다.

즉 소프트 딜리트 전환에서는 이 기본값이 중요하다.

## Repository 변경 계획

대상:

- `PromotionArticleRepository`

현재 메서드:

- `findAllByOrderByCreatedAtDesc()`
- `findByClubIdOrderByCreatedAtDesc(String clubId)`

단, 여기서 가장 중요한 함정이 있다.

기존 Mongo 문서에는 `deleted` 필드가 없을 가능성이 높다.

이 상태에서 Spring Data 파생 메서드인 아래 형태를 바로 쓰면:

- `findAllByDeletedFalseOrderByCreatedAtDesc()`
- `findByIdAndDeletedFalse(String id)`
- `existsByIdAndDeletedFalse(String id)`

Mongo 쿼리가 사실상 `deleted == false` 기준으로 나가면서
`deleted` 필드가 아예 없는 기존 문서를 포함하지 못할 가능성이 있다.

즉 "운영 DB에는 정상 게시글이 있는데 목록에서 전부 사라지는" 사고가 날 수 있다.

따라서 1차 전환에서는 `deleted != true` 기준으로 읽는 쿼리를 명시적으로 두는 편이 더 안전하다.

전환 후 권장 메서드:

- `@Query("{ 'deleted': { $ne: true } }", sort = "{ 'createdAt': -1 }") List<PromotionArticle> findAllActiveOrderByCreatedAtDesc();`
- `@Query("{ '_id': ?0, 'deleted': { $ne: true } }") Optional<PromotionArticle> findActiveById(String id);`
- `@Query(value = "{ '_id': ?0, 'deleted': { $ne: true } }", exists = true) boolean existsActiveById(String id);`

동아리별 목록이 실제로 계속 필요하다면 아래도 추가 가능하다.

- `@Query("{ 'clubId': ?0, 'deleted': { $ne: true } }", sort = "{ 'createdAt': -1 }") List<PromotionArticle> findActiveByClubIdOrderByCreatedAtDesc(String clubId);`

핵심은 아래 두 가지다.

1. "목록 조회용 메서드"와
2. "수정/업로드 대상 존재 확인용 메서드"

이 둘을 분리해 두면 실수 가능성이 줄어든다.

## Repository 실제 수정안

작업자가 바로 옮길 수 있도록 실제 파일 기준 초안을 적으면 아래와 같다.

대상:

- `backend/src/main/java/moadong/club/repository/PromotionArticleRepository.java`

권장 형태:

```java
@Repository
public interface PromotionArticleRepository extends MongoRepository<PromotionArticle, String> {

    @Query(value = "{ 'deleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
    List<PromotionArticle> findAllActiveOrderByCreatedAtDesc();

    @Query("{ 'clubId': ?0, 'deleted': { $ne: true } }")
    List<PromotionArticle> findActiveByClubIdOrderByCreatedAtDesc(String clubId);

    @Query("{ '_id': ?0, 'deleted': { $ne: true } }")
    Optional<PromotionArticle> findActiveById(String id);

    @Query(value = "{ '_id': ?0, 'deleted': { $ne: true } }", exists = true)
    boolean existsActiveById(String id);
}
```

리뷰 포인트:

1. `_id` 필드명 사용이 맞는지
2. `sort` 속성을 지원하는 현재 Spring Data Mongo 버전인지
3. `findActiveByClubIdOrderByCreatedAtDesc`가 실제 사용 중인지

만약 `sort` 속성 사용이 애매하면,
목록 메서드는 파생 쿼리 대신 `List<PromotionArticle> findByDeletedNotOrderByCreatedAtDesc(boolean deleted);`
같은 방식으로 우회할 수 있지만, 이 경우에도 `null` 포함 여부를 꼭 검증해야 한다.

## Service 변경 계획

### 1. 목록 조회

현재:

- `findAllByOrderByCreatedAtDesc()`

변경 후:

- `findAllActiveOrderByCreatedAtDesc()`

즉 삭제된 게시글은 응답 DTO로 변환되기 전에 제외한다.

### 2. 수정

현재:

- `findById(articleId)`

변경 후:

- `findActiveById(articleId)`

이렇게 바꾸면 삭제된 게시글 수정 시
기존과 동일하게 `PROMOTION_ARTICLE_NOT_FOUND` 흐름을 탈 수 있다.

### 3. 삭제

현재:

- `findById(articleId)` 후 `deleteById(articleId)`

변경 후:

- `findActiveById(articleId)`로 조회
- 없으면 `PROMOTION_ARTICLE_NOT_FOUND`
- 있으면 `article.softDelete()`
- `promotionArticleRepository.save(article)`

권장 구현 예시:

```java
@Transactional
public void deletePromotionArticle(String articleId) {
    PromotionArticle article = promotionArticleRepository.findActiveById(articleId)
        .orElseThrow(() -> new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND));

    article.softDelete();
    promotionArticleRepository.save(article);
}
```

### 4. 생성

생성은 대부분 그대로 유지 가능하다.

다만 `PromotionArticle.builder()` 생성 시
`deleted=false` 기본값이 들어가도록 엔티티 기본값에 의존한다.

## 이미지 업로드 서비스 변경 계획

대상:

- `PromotionImageUploadService`

현재:

```java
if (!promotionArticleRepository.existsActiveById(articleId)) {
    throw new RestApiException(ErrorCode.PROMOTION_ARTICLE_NOT_FOUND);
}
```

변경 후:

- 메서드명만 바꾸는 것이 아니라 "기존 null 문서도 active로 취급"하는 repository 구현을 써야 한다.

이 변경이 중요한 이유는,
소프트 딜리트된 게시글에도 이미지가 계속 업로드되는 일을 막기 위해서다.

## Controller/API 변경 계획

컨트롤러 시그니처는 크게 바꿀 필요가 없다.

즉 아래 API는 그대로 유지한다.

- `GET /api/promotion`
- `POST /api/promotion`
- `PUT /api/promotion/{articleId}`
- `DELETE /api/promotion/{articleId}`
- `POST /api/promotion/{articleId}/upload`

바뀌는 것은 내부 의미다.

- `DELETE`는 하드 딜리트가 아니라 소프트 딜리트가 된다.
- `PUT`과 `upload`는 소프트 딜리트된 게시글에 대해 사실상 `404`처럼 동작한다.

즉 API 계약을 크게 깨지 않으면서 내부 정책만 바꾸는 방식이다.

## DTO 변경 계획

기본 관리 화면만 생각하면 `deleted`, `deletedAt`를 바로 프론트에 노출할 필요는 없다.

대상:

- `PromotionArticleDto`

권장 1차 방안:

- 변경하지 않음

이유:

1. 기본 목록에서 삭제된 글은 내려주지 않으므로 프론트가 삭제 상태를 알 필요가 없다.
2. 현재 개발자 포털 UI도 "삭제된 글 보기" 기능이 없다.

후속 확장 방안:

- 추후 휴지통 화면을 만들 때 `deleted`, `deletedAt`를 DTO에 추가

## 프론트 변경 계획

개발자 포털 프론트는 큰 구조 변경 없이 유지 가능하다.

대상:

- `backend/src/main/resources/static/dev/index.html`

핵심 포인트:

1. 삭제 버튼 UX는 그대로 유지 가능
2. 삭제 성공 후 목록 재조회 시 서버가 삭제된 글을 제외하므로 현재 로직과 잘 맞음
3. 404 처리도 그대로 재사용 가능

즉 소프트 딜리트 전환 때문에 프론트에서 크게 바꿔야 하는 부분은 거의 없다.

다만 아래는 확인 필요하다.

### 1. 삭제 성공 메시지

사용자 입장에서는 여전히 "삭제되었습니다"가 맞다.

따라서 문구는 그대로 두는 편이 자연스럽다.

### 2. 수정/업로드 중 삭제된 글 처리

다른 세션에서 이미 삭제한 글을 현재 세션에서 수정/업로드하려 하면
현재 404 처리 로직이 그대로 동작해야 한다.

즉 프론트는 크게 손대지 않고,
백엔드가 삭제된 글을 not found처럼 취급하면 된다.

## 데이터 마이그레이션 계획

기존 Mongo 문서에는 `deleted`, `deletedAt` 필드가 없을 가능성이 높다.

이 경우 기본 전략은 아래 중 하나다.

### 방안 A. 코드에서 null-safe 처리

Mongo에서 필드가 없으면 Java에서 `deleted=false`로 읽히게 설계한다.

장점:

- 별도 DB 마이그레이션 없이 빠르게 전환 가능

주의:

- 직렬화/역직렬화 시 기본값 적용이 실제로 의도대로 되는지 확인 필요

### 방안 B. 일괄 마이그레이션

기존 문서에 `deleted=false`를 채우는 스크립트 또는 배치 실행

장점:

- 데이터 상태가 명확해짐

단점:

- 배포 절차가 복잡해짐

현재 기준 추천:

- 1차는 방안 A로 가되, repository 쿼리를 `deleted != true` 기준으로 작성한다
- 즉 "필드 없음(null)"과 "false"를 모두 active로 본다

## 데이터 마이그레이션 실무 판단

실제 구현 착수 기준으로는 아래 선택이 가장 안전하다.

### 추천안

1. 코드 먼저 배포
   - active 판정을 `deleted != true`로 둔다
2. 이후 운영에서 여유 있을 때 일괄 업데이트
   - 기존 문서에 `deleted=false` 채움

이 방식의 장점:

1. 즉시 배포 가능
2. 기존 문서 누락 위험 감소
3. 마이그레이션 일정이 늦어져도 기능은 안정적으로 동작

즉 "코드와 데이터 마이그레이션을 강하게 결합하지 않는다"가 포인트다.

## 테스트 계획

### 서비스 테스트

추가 또는 변경해야 할 항목:

1. 목록 조회 시 `deleted=true` 게시글은 제외되는지 검증
2. `deleted=null` 또는 필드 기본값 상태 게시글은 active로 포함되는지 검증 방식 결정
3. 삭제 호출 시 `deleteById`가 아니라 `save(article)`가 호출되는지 검증
4. 삭제 후 `deleted=true`, `deletedAt!=null`인지 검증
5. 삭제된 게시글 수정 시 `PROMOTION_ARTICLE_NOT_FOUND`가 발생하는지 검증

실제 테스트 파일:

- `backend/src/test/java/moadong/club/service/PromotionArticleServiceTest.java`

### 업로드 서비스 테스트

추가 또는 변경해야 할 항목:

1. `existsActiveById(articleId)` 기준으로만 업로드 허용 검증
2. 삭제된 게시글이면 `PROMOTION_ARTICLE_NOT_FOUND` 발생 검증

실제 테스트 파일:

- `backend/src/test/java/moadong/media/service/PromotionImageUploadServiceTest.java`

### 컨트롤러 테스트

핵심은 API 외형이 유지되는지 확인하는 것이다.

1. `DELETE /api/promotion/{articleId}` 호출 시 200과 삭제 메시지 반환
2. 내부적으로는 하드 딜리트가 아니라 서비스 soft delete 흐름 사용

실제 테스트 파일:

- `backend/src/test/java/moadong/club/controller/PromotionArticleControllerTest.java`

## 실제 코드 변경 체크리스트

구현 시작 전에 파일별 해야 할 일을 작업 단위로 쪼개면 아래와 같다.

### `PromotionArticle.java`

1. `deleted`, `deletedAt` 필드 추가
2. `softDelete()` 메서드 추가
3. 필요하면 `restore()`는 이번 단계에서는 생략

### `PromotionArticleRepository.java`

1. 하드 딜리트 전제 메서드 제거 또는 미사용 처리
2. `findAllActiveOrderByCreatedAtDesc()` 추가
3. `findActiveById(String id)` 추가
4. `existsActiveById(String id)` 추가
5. 필요 시 `findActiveByClubIdOrderByCreatedAtDesc(String clubId)` 추가

### `PromotionArticleService.java`

1. 목록 조회 메서드 교체
2. 수정 조회 메서드 교체
3. 삭제 로직을 `softDelete + save`로 전환
4. `deleteById` 호출 제거

### `PromotionImageUploadService.java`

1. `existsById`를 `existsActiveById`로 교체

### 테스트

1. 서비스 테스트 수정
2. 업로드 서비스 테스트 수정
3. 컨트롤러 테스트는 메시지 유지 확인

## 구현 시 추천 검증 순서

실제 손댈 때는 아래 순서가 안전하다.

1. 엔티티/레포지토리 수정
2. 서비스 수정
3. 업로드 서비스 수정
4. 서비스 테스트 수정
5. 업로드 서비스 테스트 수정
6. 컨트롤러 테스트 유지 확인
7. `compileJava`
8. 관련 테스트 실행

## 배포 전 확인 질문

실제 구현에 들어가기 전에 아래 항목은 문서상 결론을 이미 정해두고 시작하는 편이 좋다.

1. 삭제된 글을 운영자가 다시 볼 필요가 있는가
   - 이번 단계 답: 아니다. 기본 목록에서 숨긴다.
2. 삭제된 글 수정/업로드 요청은 어떤 에러로 볼 것인가
   - 이번 단계 답: `PROMOTION_ARTICLE_NOT_FOUND`
3. 기존 문서에 `deleted` 필드가 없으면 active로 볼 것인가
   - 이번 단계 답: 그렇다. `deleted != true`로 처리한다.
4. 복구 API를 이번에 같이 만들 것인가
   - 이번 단계 답: 아니다. 후속 과제로 둔다.

## 구현 순서

가장 안전한 순서는 아래와 같다.

1. `PromotionArticle`에 `deleted`, `deletedAt`, `softDelete()` 추가
2. `PromotionArticleRepository`에 soft-delete 기준 조회 메서드 추가
3. `PromotionArticleService#getPromotionArticles`를 `deleted=false` 기준으로 변경
4. `PromotionArticleService#updatePromotionArticle`를 `findByIdAndDeletedFalse` 기준으로 변경
5. `PromotionArticleService#deletePromotionArticle`를 soft delete로 변경
6. `PromotionImageUploadService`의 존재 확인을 `existsByIdAndDeletedFalse`로 변경
7. 관련 테스트 수정 및 추가
8. 개발자 포털 수동 검증

## 구현 완료 기준

아래 조건이 모두 만족되면 소프트 딜리트 전환 완료로 본다.

1. 삭제 API 호출 후 Mongo 문서는 남아 있다.
2. 남아 있는 문서의 `deleted=true`, `deletedAt`이 기록된다.
3. 기본 목록 조회에서는 삭제된 게시글이 보이지 않는다.
4. 삭제된 게시글은 수정할 수 없다.
5. 삭제된 게시글에는 이미지 업로드가 불가능하다.
6. 개발자 포털에서 기존 삭제 UX가 깨지지 않는다.

## 리스크와 대응

### 1. Repository 메서드 하나만 바꾸고 일부 경로를 놓칠 위험

리스크:

- 목록은 숨겨졌는데 수정/업로드는 되는 반쪽짜리 소프트 딜리트가 될 수 있다.

대응:

- `findById`, `existsById` 사용 지점을 함께 점검한다.

### 2. 기존 데이터에 `deleted` 필드가 없을 가능성

리스크:

- 예상과 다르게 삭제되지 않은 기존 문서가 누락될 수 있다.

대응:

- 운영 전 샘플 데이터로 조회 확인
- 필요 시 Mongo 마이그레이션 스크립트 준비

### 3. 향후 복구 기능 요구

리스크:

- 지금은 삭제만 soft delete이고 복구는 없음

대응:

- 이번 설계는 복구 API를 추가할 수 있게 최소 데이터 구조를 먼저 만든다

## 후속 과제

소프트 딜리트 전환 후 이어서 고려할 수 있는 작업:

1. 휴지통 목록 조회 API
2. 삭제된 게시글 복구 API
3. 관리자 UI에서 "삭제된 글 보기" 토글
4. 일정 기간 지난 soft-deleted 데이터의 완전 삭제 배치
5. `deletedBy` 기록 추가

## 최종 판단

하드 딜리트에서 소프트 딜리트로의 전환은 충분히 현실적이고,
현재 코드베이스에서도 큰 API 파손 없이 진행 가능하다.

가장 중요한 구현 원칙은 하나다.

`삭제된 게시글은 DB에는 남아 있지만, 운영 로직에서는 존재하지 않는 것처럼 취급한다.`

이 원칙만 엔티티, 조회, 수정, 업로드, 테스트 전반에 일관되게 적용하면
현재 삭제 기능을 소프트 딜리트 방식으로 안정적으로 전환할 수 있다.
