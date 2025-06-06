package moadong.media.service;

import static moadong.media.util.ClubImageUtil.containsInvalidChars;

import com.google.api.client.http.FileContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import java.io.IOException;
import java.util.Collections;
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

@Service("googleDrive")
@RequiredArgsConstructor
public class GoogleDriveClubImageService implements ClubImageService {

    @Value("${google.drive.share-file-id}")
    String shareFileId;
    @Value("${server.feed.max-count}")
    private int MAX_FEED_COUNT;

    private final Drive googleDrive;
    private final ClubRepository clubRepository;

    private final String PREFIX = "https://drive.google.com/file/d/";
    private final String SUFFIX = "/view";

    @Override
    public String uploadLogo(String clubId, MultipartFile file) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

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
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
        }
        club.updateLogo(null);
        clubRepository.save(club);
    }

    @Override
    public String uploadFeed(String clubId, MultipartFile file) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        int feedImagesCount = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND))
                .getClubRecruitmentInformation().getFeedImages().size();

        if (feedImagesCount + 1 > MAX_FEED_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
        return uploadFile(clubId, file, FileType.FEED);
    }

    @Override
    public void updateFeeds(String clubId, List<String> newFeedImageList) {
        ObjectId objectId = ObjectIdConverter.convertString(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

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

    private void deleteFeedImages(Club club, List<String> feedImages, List<String> newFeedImages) {
        for (String feedsImage : feedImages) {
            if (!newFeedImages.contains(feedsImage)) {
                deleteFile(club, feedsImage);
            }
        }
    }

    @Override
    public void deleteFile(Club club, String filePath) {
        //"https://drive.google.com/file/d/{fileId}/view" -> {fileId}
        String fileId = filePath.split("/")[5];
        try {
            googleDrive.files()
                    .delete(fileId)
                    .setSupportsAllDrives(true) // 공유 드라이브(Shared Drive)도 지원할 경우
                    .execute();
        } catch (IOException e) {
            throw new RestApiException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }

    private String uploadFile(String clubId, MultipartFile file, FileType fileType) {
        if (file == null) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }
        // MultipartFile → java.io.File 변환
        java.io.File tempFile;
        try {
            tempFile = java.io.File.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile);
        } catch (IOException e) {
            throw new RestApiException(ErrorCode.FILE_TRANSFER_ERROR);
        }

        // 메타데이터 생성
        File fileMetadata = new File();
        String fileName = file.getOriginalFilename();
        if (containsInvalidChars(fileName)) {
            fileName = RandomStringUtil.generateRandomString(10);
        }

        fileMetadata.setName(clubId + "/" + fileType + "/" + fileName);
        fileMetadata.setMimeType(file.getContentType());
        // 공유 ID 설정
        fileMetadata.setParents(Collections.singletonList(shareFileId));

        // 파일 업로드
        FileContent mediaContent = new FileContent(file.getContentType(), tempFile);
        // 전체 공개 권한 설정
        Permission publicPermission = new Permission()
                .setType("anyone")         // 누구나
                .setRole("reader");        // 읽기 권한

        File uploadedFile;
        try {
             uploadedFile= googleDrive.files().create(fileMetadata, mediaContent)
                    .setFields("id")
                    .execute();

            googleDrive.permissions().create(uploadedFile.getId(), publicPermission)
                    .setFields("id")
                    .execute();
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }finally {
            // 임시 파일 삭제
            tempFile.delete();
        }
        // 공유 링크 반환
        return PREFIX + uploadedFile.getId() + SUFFIX;
    }

}
