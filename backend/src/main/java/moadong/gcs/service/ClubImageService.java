package moadong.gcs.service;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.gcs.domain.FileType;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.RandomStringUtil;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ClubImageService {

    private final ClubRepository clubRepository;

    @Value("${google.cloud.storage.bucket.name}")
    private String bucketName;

    private final Storage storage;
    private final int MAX_FEED_COUNT = 5;


    public String uploadLogo(String clubId, MultipartFile file) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club.getClubRecruitmentInformation().getLogo());
        }

        String filePath = uploadFile(clubId, file, FileType.LOGO);
        club.updateLogo(filePath);
        clubRepository.save(club);
        return filePath;
    }

    public void deleteLogo(String clubId) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (club.getClubRecruitmentInformation().getLogo() != null) {
            deleteFile(club.getClubRecruitmentInformation().getLogo());
            club.updateLogo(null);
            clubRepository.save(club);
        }
    }

    public String uploadFeed(String clubId, MultipartFile file) {
        if (file == null) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        List<String> feedImages = club.getClubRecruitmentInformation().getFeedImages();

        if (feedImages == null || feedImages.isEmpty()) {
            feedImages = new ArrayList<>();
        } else if (feedImages.size() + 1 > MAX_FEED_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
        String url = uploadFile(clubId, file, FileType.FEED);
        feedImages.add(url);
        club.updateFeedImages(feedImages);
        clubRepository.save(club);

        return url;
    }

    public void updateFeeds(String clubId, List<String> newFeedImageList) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (newFeedImageList.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        } else if (newFeedImageList.size() > MAX_FEED_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }

        List<String> feedImages = club.getClubRecruitmentInformation().getFeedImages();
        if (feedImages != null) {
            deleteFeedList(feedImages, newFeedImageList);
        }
        club.updateFeedImages(newFeedImageList);
        clubRepository.save(club);
    }

    private void deleteFeedList(List<String> feedImages, List<String> newFeedImages) {
        for (String feedsImage : feedImages) {
            if (!newFeedImages.contains(feedsImage)) {
                deleteFile(feedsImage);
            }
        }
    }

    // TODO : Signed URL 을 통한 업로드 URL 반환으로 추후 변경
    private String uploadFile(String clubId, MultipartFile file, FileType fileType) {
        if (file == null) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }

        BlobInfo blobInfo = getBlobInfo(clubId, fileType, file);
        try {
            storage.create(blobInfo, file.getBytes()); // 파일 업로드
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }

        return "https://storage.googleapis.com/" + bucketName + "/" + blobInfo.getName();
    }

    private void deleteFile(String filePath) {
        // 삭제할 파일의 BlobId를 생성
        BlobId blobId = BlobId.of(bucketName,splitPath(filePath));

        try {
            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                throw new RestApiException(ErrorCode.IMAGE_DELETE_FAILED);
            }
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.IMAGE_DELETE_FAILED);
        }

    }

    // BlobInfo 생성 (버킷 이름, 파일 이름 지정)
    private BlobInfo getBlobInfo(String clubId, FileType fileType, MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        String contentType = file.getContentType().split("/")[1];

        if (containsKorean(originalFileName)) {
            originalFileName = RandomStringUtil.generateRandomString(10) + "." + contentType;
        }

        // 한글이 포함된 파일 이름일 경우 랜덤 영어 문자열로 변환
        String fileName = clubId + "/" + fileType.getPath() + "/" + originalFileName;
        BlobId blobId = BlobId.of(bucketName, fileName);

        return BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
    }

    private String splitPath(String path) {
        // https://storage.googleapis.com/{bucketName}/{clubId}/{fileType}/{filePath} -> {filePath}
        return path.split("/",5)[4];
    }

    private boolean containsKorean(String text) {
        text = Normalizer.normalize(text, Normalizer.Form.NFC);
        return Pattern.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*", text);
    }

}
