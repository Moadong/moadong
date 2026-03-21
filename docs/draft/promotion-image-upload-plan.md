# 홍보 게시판 이미지 업로드 구현 계획

## 배경

현재 홍보 게시판 수정 UI에서는 `images: List<String>`를 직접 편집할 수 있지만, 홍보 전용 이미지 업로드 API는 아직 없다.

임시로 `/api/banner/upload`를 재사용할 수는 있지만, 이 방식은 다음 이유로 적절하지 않다.

- 배너 업로드는 배너 도메인 전용 엔드포인트다.
- 저장 버킷도 `cloud.aws.s3.bannerbucket` 기준으로 분리되어 있다.
- 요청 파라미터로 `PlatformType`을 요구해 홍보 게시글 이미지와 의미가 맞지 않는다.
- 향후 운영/보안/정리 정책에서 배너 자산과 홍보 자산을 구분하기 어렵다.

사용자가 홍보 전용 버킷 이름 `moadong-promotion`을 이미 준비해두었고, 기존 Cloudflare R2 설정은 그대로 재사용 가능하다고 명시했으므로, 이번 작업은 배너 업로드 로직을 공통화한 뒤 홍보 게시판 전용 업로드 엔드포인트를 추가하는 방향으로 진행한다.

## 목표

개발자 포털의 홍보 게시판 관리 화면에서 다음 흐름을 지원한다.

1. 홍보 게시글을 선택한다.
2. 이미지를 직접 업로드한다.
3. 업로드 결과 URL을 즉시 `images` 목록에 추가한다.
4. 썸네일 미리보기를 확인한다.
5. 저장 시 `PUT /api/promotion/{articleId}` 요청에 해당 URL 배열이 포함된다.

## 현재 구현 상태

### 백엔드

- 홍보 게시판은 `PromotionArticleController`에 목록/생성/수정 API만 존재한다.
- `PromotionArticleCreateRequest`, `PromotionArticleUpdateRequest`는 `images`를 `List<String>`로 받는다.
- 홍보 게시글 전용 `MultipartFile` 업로드 엔드포인트는 없다.

### 이미지 업로드

- `BannerImagesController`의 `POST /api/banner/upload`가 존재한다.
- `BannerImageUploadService`는 아래 책임을 가진다.
  - 파일 유효성 검사
  - content-type 정규화
  - R2 업로드
  - 업로드 URL 반환
- 하지만 내부 구현은 아래 값에 강하게 묶여 있다.
  - `cloud.aws.s3.bannerbucket`
  - `cloud.aws.s3.banner-view-endpoint`
  - `PlatformType` 기반 key prefix

### 프론트

- 개발자 포털 `dev/index.html`의 홍보 섹션은 이미지 URL 배열 편집과 프리뷰 UI를 가진 상태다.
- 현재 업로드 버튼이 있다면 이는 임시 구현이며, 최종적으로는 홍보 전용 업로드 API를 호출하도록 교체해야 한다.

## 범위

### 포함

- 홍보 이미지 전용 업로드 API 추가
- 배너 업로드 로직의 공통부 재사용 또는 공통화
- 홍보 전용 R2 버킷 `moadong-promotion` 연결
- 개발자 포털 홍보 섹션의 업로드 호출 대상 교체
- 업로드 성공 시 이미지 URL 자동 추가 및 미리보기 유지

### 제외

- 일반 사용자용 홍보 게시판 UI 변경
- 홍보 게시글 도메인 필드 구조 변경
- 홍보 이미지 삭제 API 신규 추가
- presigned upload 방식으로의 전면 변경

## 권장 구현 방식

핵심은 "배너 업로드 서비스의 로직은 재사용하되, 배너 도메인 의존성은 제거"하는 것이다.

가장 안전한 구조는 다음과 같다.

1. 공통 업로드 서비스/헬퍼를 도입한다.
2. 배너 업로드 서비스는 해당 공통 로직을 사용하도록 얇게 유지한다.
3. 홍보 업로드 서비스도 같은 공통 로직을 사용한다.
4. 홍보 컨트롤러 또는 별도 미디어 컨트롤러에 업로드 API를 추가한다.

이 방식을 권장하는 이유는 다음과 같다.

- 파일 검증/업로드 로직 중복을 피할 수 있다.
- 버킷명과 URL endpoint만 바꿔 새로운 도메인에 쉽게 적용할 수 있다.
- 배너와 홍보 이미지의 API 의미를 명확히 분리할 수 있다.

## 설정 계획

`application.properties`에 홍보 전용 버킷 설정을 추가한다.

예상 키:

```properties
cloud.aws.s3.promotion-bucket=moadong-promotion
cloud.aws.s3.promotion-view-endpoint=https://cdn.yourun.shop
```

설명:

- 버킷명은 사용자가 지정한 `moadong-promotion`
- view endpoint는 "기존 R2 셋팅 그대로" 조건을 따라 현재 CDN/view endpoint 정책을 동일하게 사용
- 만약 실제 운영에서 홍보 전용 CDN 도메인이 따로 필요해지면 이후 설정만 분리 가능하도록 키를 분리해 둔다

주의:

- 현재 코드베이스의 다른 S3 설정 키들과 naming style이 섞여 있으므로, 새 키는 `promotion-bucket`, `promotion-view-endpoint`처럼 kebab-case로 추가하는 것이 무난하다.
- 현재 typed properties는 `AwsProperties.S3`에서 `bucket`, `endpoint`, `viewEndpoint`만 노출하고 있으므로, 새 키를 단순히 추가하는 것만으로는 기존 typed config 경로에 자동 반영되지 않는다.

구현 시 설정 바인딩 방식을 먼저 고정한다.

- 선택지 A: `AwsProperties.S3` record에 `promotionBucket`, `promotionViewEndpoint` 필드를 추가한다.
- 선택지 B: `PromotionImageUploadService`에서만 `@Value("${cloud.aws.s3.promotion-bucket}")`, `@Value("${cloud.aws.s3.promotion-view-endpoint}")`를 사용한다.

권장안:

- 1차 구현은 `PromotionImageUploadService`에 한정해 `@Value`를 사용한다.

이유:

- 변경 범위가 작고 기존 `AwsProperties` 사용처 회귀 위험이 적다.
- 배너 업로드 공통화와 홍보 업로드 추가를 빠르게 진행할 수 있다.
- 이후 promotion 관련 설정이 늘어나면 그때 `AwsProperties` 확장을 검토해도 늦지 않다.

## 상세 구현 계획

### 1. 공통 업로드 로직 추출

현재 `BannerImageUploadService` 안에 있는 아래 로직을 공통화한다.

- 파일 존재 검사
- 확장자 검사
- 최대 파일 크기 검사
- content-type 정규화
- `PutObjectRequest` 생성
- R2 업로드
- 최종 URL 생성

후보 구조:

- `MediaObjectUploadService`
- `R2ImageUploadService`
- `ImageUploadSupport`

입력값은 최소 아래 정도면 충분하다.

- `MultipartFile file`
- `String bucketName`
- `String viewEndpoint`
- `String key`

반환값:

- 최종 public URL 문자열

### 2. 배너 업로드 서비스 리팩터링

`BannerImageUploadService`는 기존 공개 API는 유지하되 내부 구현만 공통 서비스 호출로 전환한다.

배너 전용 책임은 아래만 남긴다.

- `PlatformType`으로 key prefix 계산
- 배너 버킷/뷰 엔드포인트 주입
- 배너 응답 DTO 래핑

예:

- key: `web/filename.png`
- bucket: `cloud.aws.s3.bannerbucket`

### 3. 홍보 이미지 업로드 서비스 추가

예상 클래스:

- `PromotionImageUploadService`

책임:

- 홍보 버킷/뷰 엔드포인트 설정 주입
- 홍보 이미지용 key 생성
- 공통 업로드 서비스 호출
- 응답 DTO 반환

권장 key 규칙:

- `promotion/yyyy/MM/{uuid}-{filename}`
- 또는 `articles/{articleId}/{uuid}-{filename}`

1차 권장안:

- `articles/{articleId}/{yyyy}/{MM}/{uuid}-{sanitizedFilename}`

이유:

- 현재 개발자 포털의 업로드는 "게시글을 선택한 뒤 수정하는 흐름" 안에서만 사용되므로 `articleId`를 항상 확보할 수 있다.
- 업로드 파일과 게시글 간 소유 관계를 명확히 할 수 있다.
- 저장 취소/실패 시 orphan 이미지를 추적하거나 정리하기 쉬워진다.
- 파일명 충돌 방지를 위해 UUID를 붙인다.

orphan 파일 대응 방침도 함께 고정한다.

- 1차 구현에서 별도 삭제 API는 추가하지 않지만, 최소한 articleId 기반 prefix로 추후 정리 가능성을 확보한다.
- 운영상 orphan 정리가 필요해지면 아래 둘 중 하나로 확장한다.
  - 저장 전 업로드를 임시 prefix에 올리고 완료 시 article prefix로 승격
  - 특정 article prefix 하위 미참조 파일을 정리하는 배치/관리 도구 추가

이번 1차 구현에서는 복잡도를 낮추기 위해 "articleId 기반 직접 업로드 + 추후 정리 가능성 확보"를 채택한다.

### 4. 홍보 이미지 업로드 API 추가

후보 엔드포인트:

- `POST /api/promotion/{articleId}/upload`
- 또는 `POST /api/promotion/upload?articleId=...`

권장안:

- `POST /api/promotion/{articleId}/upload`

요청:

- `multipart/form-data`
- `file`

응답:

```json
{
  "message": "홍보 이미지가 업로드되었습니다.",
  "data": {
    "imageUrl": "https://..."
  }
}
```

보안:

- `@PreAuthorize("hasRole('DEVELOPER')")`
- `@SecurityRequirement(name = "BearerAuth")`

배치 위치:

- 가장 단순한 방법은 `PromotionArticleController`에 추가
- 다만 역할상 이미지 업로드는 미디어 도메인에 가까우므로, 장기적으로는 `PromotionImageController` 분리가 더 깔끔하다

1차 권장안:

- 구현 속도를 위해 별도 `PromotionImageController`를 추가한다.

이유:

- 이미지 업로드와 게시글 CRUD 책임이 분리된다.
- 추후 삭제/정리/메타데이터 API를 추가할 때 확장성이 좋다.
- URL에 `articleId`를 포함하면 key 생성과 권한/존재 검증 기준이 명확해진다.

### 5. DTO 추가

기존 `BannerImageUploadResponse`와 동일 구조의 DTO를 재사용해도 되지만, 의미 분리를 위해 아래 둘 중 하나를 택한다.

선택지 A:

- `BannerImageUploadResponse` 재사용

선택지 B:

- `PromotionImageUploadResponse` 신규 추가

권장안:

- `PromotionImageUploadResponse` 신규 추가

이유:

- 필드 구조는 같아도 API 문서와 도메인 의미가 분리된다.
- 추후 메타데이터가 추가될 때 배너/홍보 간 결합이 줄어든다.

### 6. 프론트 교체

`backend/src/main/resources/static/dev/index.html`의 홍보 섹션에서 업로드 버튼이 호출하는 API를 아래로 변경한다.

- 기존 임시: `/api/banner/upload`
- 변경 후: `/api/promotion/{articleId}/upload`

유지할 UX:

- 게시글 미선택 시 업로드 차단
- 파일 미선택 시 에러 표시
- 업로드 성공 시 `promotionImages` textarea에 URL 추가
- 프리뷰 즉시 갱신
- 저장은 별도 `PUT /api/promotion/{articleId}`에서 수행

### 7. 예외 처리

처리해야 할 케이스:

- 로그인 안 됨 또는 개발자 권한 없음
- 존재하지 않는 `articleId`
- 파일 미선택
- 지원하지 않는 확장자
- 허용 크기 초과
- R2 업로드 실패
- 응답에서 URL 누락

UI 메시지 원칙:

- 업로드 실패 원인을 메시지 박스 또는 배너로 명확히 노출
- 업로드 성공 시 토스트 표시
- 저장과 업로드의 상태는 분리해서 관리

## 작업 순서

1. 홍보 버킷/뷰 엔드포인트 설정 키 추가
2. 홍보 업로드 설정 바인딩 방식을 `@Value`로 확정
3. 배너 업로드 서비스에서 공통화 가능한 로직 식별
4. 공통 이미지 업로드 서비스 또는 support 클래스 추가
5. 배너 업로드 서비스 리팩터링
6. 홍보 이미지 업로드 서비스 추가
7. `articleId` 기반 key 규칙 반영
8. 홍보 이미지 업로드 컨트롤러/엔드포인트 추가
9. 응답 DTO 추가 또는 공통 DTO 사용 결정
10. 개발자 포털 홍보 섹션의 업로드 API 호출 대상을 교체
11. 업로드 성공 후 프리뷰/textarea 반영 동작 확인
12. 수동 테스트 및 보정

## 검증 계획

### 백엔드

- 개발자 권한으로 `POST /api/promotion/{articleId}/upload` 호출 시 URL이 정상 반환되는지 확인
- 존재하지 않는 `articleId` 요청이 적절히 실패하는지 확인
- 파일 형식/크기 검증이 정상 동작하는지 확인
- 실제 업로드된 key가 `articles/{articleId}/...` prefix로 홍보 버킷에 저장되는지 확인
- 배너 업로드 API가 회귀 없이 동작하는지 확인

### 프론트

- 홍보 게시글 선택 후 파일 업로드가 되는지 확인
- 업로드된 URL이 `promotionImages` 필드에 자동 추가되는지 확인
- 썸네일이 즉시 노출되는지 확인
- 업로드 후 저장 시 수정 API로 정상 반영되는지 확인
- 다른 게시글로 전환 시 dirty 경고가 유지되는지 확인

## 리스크 및 확인 포인트

- 배너 업로드 로직을 무리하게 재사용하면 배너 도메인 의존성이 홍보 도메인으로 새어 나갈 수 있다.
- 홍보 이미지의 key 규칙을 너무 단순하게 잡으면 파일명 충돌 또는 orphan 추적 어려움이 생긴다.
- view endpoint를 기존과 동일하게 쓰더라도, CDN 캐시 정책이 배너와 홍보에서 달라야 할 가능성은 남아 있다.
- 향후 일반 사용자 작성 기능이 생기면 개발자 전용 업로드 API와 별도 정책이 필요할 수 있다.
- `articleId` 기반 업로드를 도입하면 업로드 시점에 게시글 선택이 필수라는 UX 제약이 생기지만, 현재 개발자 포털 흐름과는 잘 맞는다.

## 권장 결정

이번 구현은 다음 기준으로 진행한다.

- `/api/banner/upload` 재사용은 제거한다.
- 홍보 전용 엔드포인트 `POST /api/promotion/{articleId}/upload`를 추가한다.
- 버킷은 `moadong-promotion`을 사용한다.
- 기존 R2 클라이언트와 업로드 검증 로직은 공통화하여 재사용한다.
- 홍보 전용 설정은 1차 구현에서 `PromotionImageUploadService`의 `@Value`로 주입한다.
- 업로드 key는 `articles/{articleId}/...` 규칙을 사용해 orphan 추적 가능성을 확보한다.
- 프론트는 새 엔드포인트만 호출하고, 저장 구조는 기존 `images: List<String>`를 유지한다.

이 방식이 가장 빠르면서도 도메인 경계를 지키고, 이후 확장에도 유리하다.
