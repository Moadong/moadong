package moadong.media.service;

import static moadong.media.util.ClubImageUtil.containsInvalidChars;
import static moadong.media.util.ClubImageUtil.isImageExtension;
import static moadong.media.util.ClubImageUtil.resizeImage;

import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.ObjectIdConverter;
import moadong.global.util.RandomStringUtil;
import moadong.media.domain.FileType;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service("cloudflare")
@RequiredArgsConstructor
public class CloudflareImageService implements ClubImageService{

    private final ClubRepository clubRepository;

    private final S3Client s3Client;

    @Value("${server.feed.max-count}")
    private int MAX_FEED_COUNT;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.s3.view-endpoint}")
    private String viewEndpoint;
    @Value("${server.image.max-size}")
    private long MAX_SIZE;

    @Override
    public String uploadLogo(String clubId, MultipartFile file) {
        Club club = getClub(clubId);

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
        }

        String filePath = uploadFile(clubId, file, FileType.LOGO);
        club.updateLogo(filePath);
        clubRepository.save(club);
        return filePath;
    }

    @Override
    public void deleteLogo(String clubId) {
        Club club = getClub(clubId);

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
        }
        club.updateLogo(null);
        clubRepository.save(club);
    }

    @Override
    public String uploadFeed(String clubId, MultipartFile file) {
        int feedImagesCount = getClub(clubId).getClubRecruitmentInformation().getFeedImages().size();

        if (feedImagesCount + 1 > MAX_FEED_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
        return uploadFile(clubId, file, FileType.FEED);
    }

    @Override
    public void updateFeeds(String clubId, List<String> newFeedImageList) {
        Club club = getClub(clubId);

        if (newFeedImageList.size() > MAX_FEED_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }

        List<String> feedImages = club.getClubRecruitmentInformation().getFeedImages();
        if (feedImages != null  && !feedImages.isEmpty()) {
            deleteFeedImages(club, feedImages, newFeedImageList);
        }
        club.updateFeedImages(newFeedImageList);
        clubRepository.save(club);

    }

    private Club getClub(String clubId) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        return clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
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
        // https://pub-8655aea549d544239ad12d0385aa98aa.r2.dev/{key} -> {key}
        String key = filePath.substring(viewEndpoint.length()+1);

        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        s3Client.deleteObject(deleteRequest);
    }

    private String uploadFile(String clubId, MultipartFile file, FileType fileType) {
        if (file == null || file.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }

        // 파일명 처리
        String fileName = file.getOriginalFilename();

        if (!isImageExtension(fileName)) {
            throw new RestApiException(ErrorCode.UNSUPPORTED_FILE_TYPE);
        }
        if (containsInvalidChars(fileName)) {
            fileName = RandomStringUtil.generateRandomString(10);
        }
        if (file.getSize() > MAX_SIZE) {
            try {
                file = resizeImage(file, MAX_SIZE);
            } catch (IOException e) {
                throw new RestApiException(ErrorCode.FILE_TRANSFER_ERROR);
            }
        }

        // S3에 저장할 key 경로 생성
        String key = clubId + "/" + fileType + "/" + fileName;

        // S3 업로드 요청
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ)  // 공개 URL 용도
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(
                    file.getInputStream(),
                    file.getSize()
            ));

        } catch (IOException e) {
            throw new RestApiException(ErrorCode.FILE_TRANSFER_ERROR);
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }

        // 공유 가능한 공개 URL 반환
        return viewEndpoint + "/" + key;
    }

}
