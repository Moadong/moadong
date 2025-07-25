//package moadong.media.service;
//
//import static moadong.media.util.ClubImageUtil.containsInvalidChars;
//
//import com.google.cloud.storage.BlobId;
//import com.google.cloud.storage.BlobInfo;
//import com.google.cloud.storage.Storage;
//import java.util.List;
//import lombok.RequiredArgsConstructor;
//import moadong.club.entity.Club;
//import moadong.club.repository.ClubRepository;
//import moadong.global.exception.ErrorCode;
//import moadong.global.exception.RestApiException;
//import moadong.global.util.ObjectIdConverter;
//import moadong.global.util.RandomStringUtil;
//import moadong.media.domain.FileType;
//import org.bson.types.ObjectId;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//@Service
//@RequiredArgsConstructor
//public class GcsClubImageService implements ClubImageService {
//
//    private final ClubRepository clubRepository;
//
//    @Value("${google.cloud.storage.bucket.name}")
//    private String bucketName;
//
//    @Value("${server.feed.max-count}")
//    private int MAX_FEED_COUNT;
//
//    private final Storage storage;
//
//    @Override
//    public String uploadLogo(String clubId, MultipartFile file) {
//        ObjectId objectId = ObjectIdConverter.convertString(clubId);
//        Club club = clubRepository.findClubById(objectId)
//                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
//
//        if (club.getClubRecruitmentInformation().getLogo() != null) {
//            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
//        }
//
//        String filePath = uploadFile(clubId, file, FileType.LOGO);
//        club.updateLogo(filePath);
//        clubRepository.save(club);
//        return filePath;
//    }
//
//    @Override
//    public void deleteLogo(String clubId) {
//        ObjectId objectId = ObjectIdConverter.convertString(clubId);
//        Club club = clubRepository.findClubById(objectId)
//                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
//
//        if (club.getClubRecruitmentInformation().getLogo() != null) {
//            deleteFile(club, club.getClubRecruitmentInformation().getLogo());
//        }
//    }
//
//    @Override
//    public String uploadFeed(String clubId, MultipartFile file) {
//        ObjectId objectId = ObjectIdConverter.convertString(clubId);
//        int feedImagesCount = clubRepository.findClubById(objectId)
//                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND))
//                .getClubRecruitmentInformation().getFeedImages().size();
//
//        if (feedImagesCount + 1 > MAX_FEED_COUNT) {
//            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
//        }
//        return uploadFile(clubId, file, FileType.FEED);
//    }
//
//    @Override
//    public void updateFeeds(String clubId, List<String> newFeedImageList) {
//        ObjectId objectId = ObjectIdConverter.convertString(clubId);
//        Club club = clubRepository.findClubById(objectId)
//                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
//
//        if (newFeedImageList.size() > MAX_FEED_COUNT) {
//            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
//        }
//
//        List<String> feedImages = club.getClubRecruitmentInformation().getFeedImages();
//        if (feedImages != null  && !feedImages.isEmpty()) {
//            deleteFeedImages(club, feedImages, newFeedImageList);
//        }
//        club.updateFeedImages(newFeedImageList);
//        clubRepository.save(club);
//    }
//
//    private void deleteFeedImages(Club club, List<String> feedImages, List<String> newFeedImages) {
//        for (String feedsImage : feedImages) {
//            if (!newFeedImages.contains(feedsImage)) {
//                deleteFile(club, feedsImage);
//            }
//        }
//    }
//
//    private String uploadFile(String clubId, MultipartFile file, FileType fileType) {
//        if (file == null) {
//            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
//        }
//
//        BlobInfo blobInfo = getBlobInfo(clubId, fileType, file);
//        try {
//            storage.create(blobInfo, file.getBytes()); // 파일 업로드
//        } catch (Exception e) {
//            throw new RestApiException(ErrorCode.IMAGE_UPLOAD_FAILED);
//        }
//
//        return "https://storage.googleapis.com/" + bucketName + "/" + blobInfo.getName();
//    }
//
//    @Override
//    public void deleteFile(Club club, String filePath) {
//        // 삭제할 파일의 BlobId를 생성
//        BlobId blobId = BlobId.of(bucketName,splitPath(filePath));
//
//        try {
//            boolean deleted = storage.delete(blobId);
//            if (!deleted) {
//                throw new RestApiException(ErrorCode.IMAGE_DELETE_FAILED);
//            }
//        } catch (Exception e) {
//            throw new RestApiException(ErrorCode.IMAGE_DELETE_FAILED);
//        }
//
//        // https://storage.googleapis.com/{bucketName}/{clubId}/{fileType}/{filePath} -> {fileType}
//        String fileType = filePath.split("/")[5];
//        if (fileType.equals("logo")) {
//            club.updateLogo(null);
//            clubRepository.save(club);
//        }
//    }
//
//    // BlobInfo 생성 (버킷 이름, 파일 이름 지정)
//    private BlobInfo getBlobInfo(String clubId, FileType fileType, MultipartFile file) {
//        String originalFileName = file.getOriginalFilename();
//        String contentType = file.getContentType().split("/")[1];
//
//        if (containsInvalidChars(originalFileName)) {
//            originalFileName = RandomStringUtil.generateRandomString(10) + "." + contentType;
//        }
//
//        // 한글이 포함된 파일 이름일 경우 랜덤 영어 문자열로 변환
//        String fileName = clubId + "/" + fileType.getPath() + "/" + originalFileName;
//        BlobId blobId = BlobId.of(bucketName, fileName);
//
//        return BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
//    }
//
//    private String splitPath(String path) {
//        // https://storage.googleapis.com/{bucketName}/{clubId}/{fileType}/{filePath} -> {filePath}
//        return path.split("/",5)[4];
//    }
//
//}
