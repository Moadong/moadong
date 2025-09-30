package moadong.club.payload.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.ClubApplicant;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.enums.ApplicantStatus;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.AESCipher;

@Builder
@Slf4j
public record ClubApplicantsResult(
        String id,
        ApplicantStatus status,
        List<ClubQuestionAnswer> answers,
        String memo,
        LocalDateTime createdAt
) {
    public static ClubApplicantsResult of(ClubApplicant application, AESCipher cipher) {
        List<ClubQuestionAnswer> decryptedAnswers = new ArrayList<>();
        try {
            for (ClubQuestionAnswer answer : application.getAnswers()) {
                String decryptedValue = cipher.decrypt(answer.getValue());
                decryptedAnswers.add(ClubQuestionAnswer.builder()
                        .id(answer.getId())
                        .value(decryptedValue)
                        .build());
            }
        } catch (Exception e) {
            log.error("AES_CIPHER_ERROR", e);
            throw new RestApiException(ErrorCode.AES_CIPHER_ERROR);
        }

        return ClubApplicantsResult.builder()
                .id(application.getId())
                .status(application.getStatus())
                .answers(decryptedAnswers)
                .memo(application.getMemo())
                .createdAt(application.getCreatedAt())
                .build();
    }
}