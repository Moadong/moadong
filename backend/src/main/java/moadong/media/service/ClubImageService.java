package moadong.media.service;

import java.util.List;
import moadong.club.entity.Club;
import moadong.media.dto.PresignedUploadResponse;

public interface ClubImageService {

    void deleteLogo(String clubId);

    void updateFeeds(String clubId, List<String> newFeedImageList);

    void deleteFile(Club club, String filePath);

    void deleteCover(String clubId);

    // Presigned URL 방식 메서드
    PresignedUploadResponse generateLogoUploadUrl(String clubId, String fileName, String contentType);

    PresignedUploadResponse generateFeedUploadUrl(String clubId, String fileName, String contentType);

    PresignedUploadResponse generateCoverUploadUrl(String clubId, String fileName, String contentType);

    void completeLogoUpload(String clubId, String fileUrl);

    void completeFeedUpload(String clubId, String fileUrl);

    void completeCoverUpload(String clubId, String fileUrl);
}
