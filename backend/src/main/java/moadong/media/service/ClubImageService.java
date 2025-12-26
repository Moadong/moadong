package moadong.media.service;

import java.util.List;
import moadong.club.entity.Club;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadUrlRequest;

public interface ClubImageService {

    void deleteLogo(String clubId, String userId);

    void updateFeeds(String clubId, String userId, List<String> newFeedImageList);

    void deleteFile(Club club, String filePath);

    void deleteCover(String clubId, String userId);

    // Presigned URL 방식 메서드
    PresignedUploadResponse generateLogoUploadUrl(String clubId, String userId, String fileName, String contentType);

    List<PresignedUploadResponse> generateFeedUploadUrls(String clubId, String userId, List<UploadUrlRequest> requests);

    PresignedUploadResponse generateCoverUploadUrl(String clubId, String userId, String fileName, String contentType);

    void completeLogoUpload(String clubId, String userId, String fileUrl);

    void completeCoverUpload(String clubId, String userId, String fileUrl);
}
