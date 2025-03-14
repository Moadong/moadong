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
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
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

        String filePath = uploadFile(clubId, file, "logo");
        club.updateLogo(filePath);
        clubRepository.save(club);
        return filePath;
    }

    public void uploadFeeds(String clubId, List<MultipartFile> files) {
        ObjectId objectId = new ObjectId(clubId);
        Club club = clubRepository.findClubById(objectId)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        if (files.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        } else if (files.size() + club.getClubRecruitmentInformation().getFeedAmounts() > MAX_FEED_COUNT) {
            throw new RestApiException(ErrorCode.TOO_MANY_FILES);
        }
        List<String> feedImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null) {
                throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
            }
            String filePath = uploadFile(clubId, file, "feed");
            feedImages.add(filePath);
        }

        club.updateFeedImages(feedImages);
        clubRepository.save(club);
    }


    private String uploadFile(String clubId, MultipartFile file, String fileType) {

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

    public void deleteFile(String filePath) {
        // 삭제할 파일의 BlobId를 생성
        // TODO: deleteFile은 clubId가 필요해짐 club 컬렉션 안에 이미지들이 존재하기 때문
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
//        if (fileType.equals("feed")) {
//            clubFeedImageRepository.deleteAllByImage(filePath);
//
//        } else if (fileType.equals("logo")) {
//            ClubRecruitmentInformation clubRecruitmentInformation = clubInformationRepository.findByLogo(filePath)
//                    .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND));
//            clubInformationRepository.save(clubRecruitmentInformation.updateLogo(null));
//        }
    }

    // BlobInfo 생성 (버킷 이름, 파일 이름 지정)
    private BlobInfo getBlobInfo(String clubId, String fileType, MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        String contentType = file.getContentType().split("/")[1];

        if (containsKorean(originalFileName)) {
            originalFileName = RandomStringUtil.generateRandomString(10) + "." + contentType;
        }

        // 한글이 포함된 파일 이름일 경우 랜덤 영어 문자열로 변환
        String fileName = clubId + "/" + fileType + "/" + originalFileName;
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
