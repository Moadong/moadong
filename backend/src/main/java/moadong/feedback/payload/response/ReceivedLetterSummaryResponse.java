package moadong.feedback.payload.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.LetterCategory;

import java.time.Instant;

public record ReceivedLetterSummaryResponse(
        String id,
        LetterCategory category,
        String title,
        String preview,
        Instant createdAt,
        @JsonProperty("isRead")
        boolean isRead
) {

    public static ReceivedLetterSummaryResponse from(Letter letter, String studentId) {
        return new ReceivedLetterSummaryResponse(
                letter.getId(),
                letter.getCategory(),
                letter.getTitle(),
                letter.preview(),
                letter.getCreatedAt(),
                letter.isReadBy(studentId)
        );
    }
}
