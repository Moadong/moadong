package moadong.feedback.service;

import lombok.RequiredArgsConstructor;
import moadong.feedback.payload.response.LetterImageUploadResponse;
import moadong.global.config.properties.AwsProperties;
import moadong.media.service.R2ImageUploadService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

/**
 * 편지 본문에 넣을 이미지 업로드. 운영자(ROLE_DEVELOPER)만 호출하므로
 * 홍보 게시판 · 배너와 같은 멀티파트 방식이다. 업로드 후 받은 URL을 본문에 마크다운으로 삽입한다.
 * <p>
 * 사용자가 피드백에 첨부하는 사진({@link FeedbackImageService})과는 인증 주체가 달라 별개의 경로다.
 */
@Service
@RequiredArgsConstructor
public class LetterImageUploadService {

    private final R2ImageUploadService r2ImageUploadService;
    private final AwsProperties awsProperties;

    public LetterImageUploadResponse upload(MultipartFile file) {
        String imageUrl = r2ImageUploadService.upload(
                file,
                awsProperties.s3().bucket(),
                awsProperties.s3().viewEndpoint(),
                buildKey(file));
        return new LetterImageUploadResponse(imageUrl);
    }

    private String buildKey(MultipartFile file) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        String originalFilename = (file != null) ? file.getOriginalFilename() : null;
        String filename = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        return "feedback/letters/" + today.getYear()
                + "/" + String.format("%02d", today.getMonthValue())
                + "/" + UUID.randomUUID() + "-" + sanitizeFilename(StringUtils.getFilename(filename));
    }

    private String sanitizeFilename(String filename) {
        String safeName = StringUtils.hasText(filename) ? filename : "image";
        return safeName.replaceAll("[^A-Za-z0-9._-]", "_");
    }
}
