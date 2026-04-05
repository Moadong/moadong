# 배너 이미지 업로드 확장자 처리 통합 (2026-04-05)

## 배경

`BannerImageUploadService`에서 확장자 없는 파일명을 content-type으로 보정해 `key`를 생성하는 `ensureExtension()`이 추가됐으나, 실제 업로드를 담당하는 `R2ImageUploadService`의 검증 로직은 여전히 `file.getOriginalFilename()` 기준으로 동작하고 있었다.

결과적으로 확장자 없는 파일 + 유효한 content-type 조합이 들어오면:
- `key`는 `web/image.jpg`로 올바르게 생성되지만
- `R2ImageUploadService.validateFile()`이 `isImageExtension("image") → false`로 판단해 `UNSUPPORTED_FILE_TYPE` 예외를 던짐

즉, content-type 기반 확장자 보정 의도가 업로드 판정 경로에 반영되지 않는 구조적 불일치.

## 변경 내용

**`R2ImageUploadService`**

### `validateFile()`

기존: `isImageExtension(originalFilename)`이 false이면 즉시 예외.

변경: 확장자 검증 실패 시 content-type을 fallback으로 사용. 둘 다 유효하지 않을 때만 예외.

```java
boolean hasValidExtension = isImageExtension(originalFilename);
boolean hasValidContentType = StringUtils.hasText(normalizedContentType)
    && normalizedContentType.matches("^image/(jpeg|jpg|png|gif|bmp|webp)$");

if (!hasValidExtension && !hasValidContentType) {
    throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
}
if (StringUtils.hasText(normalizedContentType) && !hasValidContentType) {
    throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
}
```

### `getFileExtension(fileName, contentType)`

기존: 파일명에 확장자 없으면 `UNSUPPORTED_FILE_TYPE` 예외.

변경: 파일명에 확장자 없으면 content-type에서 확장자를 도출 (`BannerImageUploadService.ensureExtension()`과 동일한 로직).

```java
private String getFileExtension(String fileName, String contentType) {
    String extension = StringUtils.getFilenameExtension(fileName);
    if (StringUtils.hasText(extension)) {
        return "." + extension.toLowerCase(Locale.ROOT);
    }
    if (StringUtils.hasText(contentType)) {
        return switch (contentType.toLowerCase(Locale.ROOT)) {
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/gif"  -> ".gif";
            case "image/bmp"  -> ".bmp";
            case "image/webp" -> ".webp";
            default -> throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        };
    }
    throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
}
```

## 동작 케이스 정리

| 파일명 | content-type | 결과 |
|--------|-------------|------|
| `image.jpg` | `image/jpeg` | 정상 업로드 |
| `image` | `image/jpeg` | 정상 업로드 (content-type fallback) |
| `image` | `null` | `UNSUPPORTED_FILE_TYPE` |
| `image` | `image/svg+xml` | `UNSUPPORTED_FILE_TYPE` |
| `image.png` | `image/svg+xml` | `UNSUPPORTED_FILE_TYPE` |

## 영향 범위

- `BannerImageUploadService` — 변경 없음 (기존 `ensureExtension` 유지)
- `R2ImageUploadService` — `validateFile()`, `getFileExtension()` 수정
- 기존 테스트 모두 통과
- 신규 테스트 2건 추가 (`R2ImageUploadServiceTest`)
