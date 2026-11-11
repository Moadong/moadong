package moadong.feedback.payload;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.LetterCategory;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

@UnitTest
class FeedbackSerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Test
    void 받은_편지_요약은_isRead_키로_직렬화된다() throws Exception {
        Letter letter = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.UPDATE)
                .title("업데이트")
                .body("본문")
                .readStudentIds(Set.of())
                .build();

        String json = objectMapper.writeValueAsString(
                moadong.feedback.payload.response.ReceivedLetterSummaryResponse.from(letter, "student-1"));

        assertTrue(json.contains("\"isRead\""), "프론트가 isRead 키를 읽는다. 실제 직렬화: " + json);
        assertTrue(json.contains("\"createdAt\":\""), "createdAt은 ISO8601 문자열이어야 한다. 실제 직렬화: " + json);
    }
}
