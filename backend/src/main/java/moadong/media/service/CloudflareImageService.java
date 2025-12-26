package moadong.media.service;

import static moadong.media.util.ClubImageUtil.isImageExtension;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.ObjectIdConverter;
import moadong.global.util.RandomStringUtil;
import moadong.media.domain.FileType;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Slf4j
@Service("cloudflare")
@RequiredArgsConstructor
public class CloudflareImageService implements ClubImageService{

    private final ClubRepository clubRepository;

    private final S3Client s3Client;

    private final S3Presigner s3Presigner;

    @Value("${server.feed.max-count}")
    private int MAX_FEED_COUNT;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.s3.view-endpoint}")
    private String viewEndpoint;
    @Value("${server.image.max-size}")
    private long maxImageSizeBytes;
    @Value("${server.file-url.max-length:200}")
    private int maxFileUrlLength;
    @Value("${server.file-url.expiration-time:10}")
    private int expirationTime;
    private String normalizedViewEndpoint;

    @PostConstruct
    private void init() {
        if (viewEndpoint == null || viewEndpoint.isEmpty()) {
            throw new IllegalStateException("cloud.aws.s3.view-endpoint must be configured");
        }
        // viewEndpoint 정규화: 후행 슬래시 제거
        normalizedViewEndpoint = viewEndpoint.replaceAll("/+$", "");
    }

    @Override
    @Transactional
    public void deleteLogo(String clubId, String userId) {
        Club club = getAuthorizedClub(clubId, userId);
        validateClubRecruitmentInformation(club);

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
        }
        club.updateLogo(null);
        clubRepository.save(club);
    }

    @Override
    @Transactional
    public void updateFeeds(String clubId, String userId, List<String> newFeedImageList) {
		Club club = getAuthorizedClub(clubId, userId);
		validateClubRecruitmentInformation(club);

		if (newFeedImageList == null) {
			newFeedImageList = java.util.Collections.emptyList();
		}

		if (newFeedImageList.size() > MAX_FEED_COUNT) {
			throw new RestApiException(ErrorCode.TOO_MANY_FILES);
		}

		//리스트에 대해 URL 제약 검증
		for (String url : newFeedImageList) {
			validateFileConstraints(club.getId(), FileType.FEED, url);
		}

		//검증 통과 후 누락된 기존 파일만 삭제
		List<String> existingFeedImages = club.getClubRecruitmentInformation().getFeedImages();
		if (existingFeedImages != null && !existingFeedImages.isEmpty()) {
			deleteFeedImages(club, existingFeedImages, newFeedImageList);
		}

		club.updateFeedImages(newFeedImageList);
		clubRepository.save(club);

    }

    private Club getAuthorizedClub(String clubId, String userId) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (!club.getUserId().equals(userId)) {
            throw new RestApiException(ErrorCode.USER_UNAUTHORIZED);
        }
        return club;
    }

    private void deleteFeedImages(Club club, List<String> feedImages, List<String> newFeedImages) {
        for (String feedsImage : feedImages) {
            if (!newFeedImages.contains(feedsImage)) {
                deleteFile(club, feedsImage);
            }
        }
    }

    @Override
    public void deleteFile(Club club, String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            log.warn("deleteFile called with null or empty filePath for club: {}", club.getId());
            return;
        }

        String key = extractKeyOrNull(filePath);
        if (key == null) {
            log.warn("Invalid filePath format for club {}: expected prefix {}", club.getId(), normalizedViewEndpoint + "/");
            return;
        }

        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try {
            s3Client.deleteObject(deleteRequest);
        } catch (S3Exception e) {
            // 파일이 이미 없거나 삭제 권한이 없는 경우 로그만 남기고 계속 진행
            log.warn("Failed to delete file from S3 for club {}: key={}, error={}", club.getId(), key, e.getMessage());
        } catch (Exception e) {
            log.warn("Unexpected error while deleting file from S3 for club {}: key={}, error={}", club.getId(), key, e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteCover(String clubId, String userId) {
        Club club = getAuthorizedClub(clubId, userId);
        validateClubRecruitmentInformation(club);

        if (club.getClubRecruitmentInformation().getCover() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getCover());
        }
        club.updateCover(null);
        clubRepository.save(club);
    }

    @Override
    public PresignedUploadResponse generateLogoUploadUrl(String clubId, String userId, String fileName, String contentType) {
        getAuthorizedClub(clubId, userId);
        validateFileName(fileName);
        return generatePresignedUrl(clubId, fileName, contentType, FileType.LOGO);
    }

    @Override
    public List<PresignedUploadResponse> generateFeedUploadUrls(String clubId, String userId, List<UploadUrlRequest> requests) {
        Club club = getAuthorizedClub(clubId, userId);
        validateClubRecruitmentInformation(club);
        int existingCount = (club.getClubRecruitmentInformation().getFeedImages() == null)
            ? 0
            : club.getClubRecruitmentInformation().getFeedImages().size();
        int remaining = Math.max(0, MAX_FEED_COUNT - existingCount);
        if (remaining == 0) {
            return java.util.List.of(errorResponse(ErrorCode.TOO_MANY_FILES));
        }

        int limit = Math.min(remaining, requests.size());
        java.util.ArrayList<PresignedUploadResponse> results = new java.util.ArrayList<>(limit + 1);
        for (int i = 0; i < limit; i++) {
            UploadUrlRequest req = requests.get(i);
            try {
                validateFileName(req.fileName());
                results.add(generatePresignedUrl(clubId, req.fileName(), req.contentType(), FileType.FEED));
            } catch (RestApiException e) {
                results.add(errorResponse(e.getErrorCode()));
            } catch (Exception e) {
                log.error("Unexpected error generating presigned URL: clubId={}, fileName={}", clubId, req.fileName(), e);
                results.add(errorResponse(ErrorCode.IMAGE_UPLOAD_FAILED));
            }
        }
        if (requests.size() > limit) {
            results.add(errorResponse(ErrorCode.TOO_MANY_FILES));
        }
        return results;
    }

    @Override
    public PresignedUploadResponse generateCoverUploadUrl(String clubId, String userId, String fileName, String contentType) {
        getAuthorizedClub(clubId, userId);
        validateFileName(fileName);
        return generatePresignedUrl(clubId, fileName, contentType, FileType.COVER);
    }

    @Override
    @Transactional
    public void completeLogoUpload(String clubId, String userId, String fileUrl) {
        validateFileConstraints(clubId, FileType.LOGO, fileUrl);
        Club club = getAuthorizedClub(clubId, userId);
        validateClubRecruitmentInformation(club);

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
        }

        club.updateLogo(fileUrl);
        clubRepository.save(club);
    }

    @Override
    @Transactional
    public void completeCoverUpload(String clubId, String userId, String fileUrl) {
        validateFileConstraints(clubId, FileType.COVER, fileUrl);
        Club club = getAuthorizedClub(clubId, userId);
        validateClubRecruitmentInformation(club);

        if (club.getClubRecruitmentInformation().getCover() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getCover());
        }

        club.updateCover(fileUrl);
        clubRepository.save(club);
    }


    private void validateFileConstraints(String clubId, FileType fileType, String fileUrl) {
        if (fileUrl == null || fileUrl.length() > maxFileUrlLength) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }
        String key = extractKeyOrNull(fileUrl);
        if (key == null || !key.startsWith(clubId + "/" + fileType.getPath() + "/")) {
            throw new RestApiException(ErrorCode.INVALID_FILE_URL);
        }
        // R2 HEAD로 사이즈 확인
        try {
            HeadObjectRequest headReq = HeadObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
            long contentLength = s3Client.headObject(headReq).contentLength();
            if (contentLength > maxImageSizeBytes) {
                // 초과 시 삭제 후 예외
                try {
                    DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                    s3Client.deleteObject(deleteRequest);
                } catch (S3Exception e) {
                    log.warn("Failed to delete oversized object from R2: key={}, error={}", key, e.getMessage());
                }
                throw new RestApiException(ErrorCode.FILE_TOO_LARGE);
            }
        } catch (NoSuchKeyException e) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        } catch (S3Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    /**
     * viewEndpoint 접두를 검증하고 S3 key를 추출한다.
     * 접두 불일치나 비정상 URL이면 null을 반환한다(호출자에서 처리).
     */
    private String extractKeyOrNull(String fileUrl) {
        String prefix = normalizedViewEndpoint + "/";
        if (fileUrl == null || !fileUrl.startsWith(prefix)) {
            return null;
        }
        return fileUrl.substring(prefix.length());
    }

    private PresignedUploadResponse generatePresignedUrl(String clubId, String fileName, String contentType, FileType fileType) {
        String extension = "";
        if (fileName.contains(".")) {
            extension = fileName.substring(fileName.lastIndexOf("."));
        }
        String processedFileName = RandomStringUtil.generateRandomString(10) + extension;

        // S3에 저장할 key 경로 생성
        String key = clubId + "/" + fileType.getPath() + "/" + processedFileName;

        // PutObjectRequest 생성
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        // Presigned URL 생성 (10분 유효)
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(expirationTime))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
        String presignedUrl = presignedRequest.url().toString();
        // 정규화된 viewEndpoint 사용하여 finalUrl 생성
        String finalUrl = normalizedViewEndpoint + "/" + key;

        // 클라이언트가 파일 업로드 시 필요한 헤더 정보 생성
        Map<String, String> requiredHeaders = new HashMap<>();
        requiredHeaders.put("Content-Type", contentType);

        return new PresignedUploadResponse(presignedUrl, finalUrl, requiredHeaders, true, null);
    }

    private PresignedUploadResponse errorResponse(ErrorCode code) {
        return new PresignedUploadResponse(null, null, null, false, code.getMessage());
    }
    private void validateFileName(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }
        if (!isImageExtension(fileName)) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
    }

    private void validateClubRecruitmentInformation(Club club) {
        if (club.getClubRecruitmentInformation() == null) {
            log.error("ClubRecruitmentInformation is null for club: {}", club.getId());
            throw new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND);
        }
    }

}
