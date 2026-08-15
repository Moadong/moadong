package moadong.feedback.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.LetterCategory;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ReceivedLetterDetailResponse(
        String id,
        LetterCategory category,
        String title,
        Instant createdAt,
        String body,
        // category = REPLY 일 때만 채워진다. 상세 화면의 "내가 보낸 편지" 인용 카드에 쓰인다.
        SentFeedbackResponse myFeedback
) {

    public static ReceivedLetterDetailResponse of(Letter letter, SentFeedbackResponse myFeedback) {
        return new ReceivedLetterDetailResponse(
                letter.getId(),
                letter.getCategory(),
                letter.getTitle(),
                letter.getCreatedAt(),
                letter.getBody(),
                myFeedback
        );
    }
}
