package moadong.club.payload.dto;

import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.ClubApplication;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.enums.ApplicationStatus;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.AESCipher;

import java.util.ArrayList;
import java.util.List;

@Builder
@Slf4j
public record ClubApplicantsResult(
        String questionId,
        ApplicationStatus status,
        List<ClubQuestionAnswer> answers
) {
    public static ClubApplicantsResult of(ClubApplication application, AESCipher cipher) {
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
                .questionId(application.getQuestionId())
                .status(application.getStatus())
                .answers(decryptedAnswers)
                .build();
    }
}