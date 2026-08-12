package moadong.feedback.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.enums.LetterCategory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;

@Document("feedback_letters")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Letter {

    private static final int PREVIEW_LENGTH = 60;

    @Id
    private String id;

    private LetterCategory category;

    /**
     * REPLY 편지의 수신자. UPDATE / STORY 처럼 전체에게 발행하는 편지는 null이다.
     */
    @Indexed
    private String recipientStudentId;

    /**
     * REPLY 편지가 답장하는 원본 피드백. 그 외 카테고리는 null이다.
     */
    private String feedbackId;

    private String title;

    private String body;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Set<String> readStudentIds = Set.of();

    public boolean isBroadcast() {
        return recipientStudentId == null;
    }

    public boolean isReadableBy(String studentId) {
        return isBroadcast() || recipientStudentId.equals(studentId);
    }

    public boolean isReadBy(String studentId) {
        return readStudentIds != null && readStudentIds.contains(studentId);
    }

    /**
     * 목록에 한 줄로 노출할 요약이자 답장 푸시의 본문. 마크다운 기호를 걷어낸 뒤 서버에서 잘라 내려준다.
     * <p>
     * 기호를 남기면 이미지 URL 한 줄이 요약 길이를 통째로 차지해 정작 내용이 보이지 않는다.
     */
    public String preview() {
        String flattened = body == null ? "" : stripMarkdown(body).replaceAll("\\s+", " ").trim();
        return flattened.length() <= PREVIEW_LENGTH
                ? flattened
                : flattened.substring(0, PREVIEW_LENGTH) + "...";
    }

    /**
     * 이미지는 통째로, 링크는 표시 텍스트만 남기고 걷어낸다.
     * 이미지 문법이 링크 문법을 포함하므로 반드시 이미지를 먼저 지운다.
     */
    private static String stripMarkdown(String markdown) {
        return markdown
                .replaceAll("!\\[[^\\]]*\\]\\([^)]*\\)", "")
                .replaceAll("\\[([^\\]]*)\\]\\([^)]*\\)", "$1")
                .replaceAll("\\*{1,2}", "");
    }

    public static Letter reply(String recipientStudentId, String feedbackId, String title, String body) {
        return Letter.builder()
                .category(LetterCategory.REPLY)
                .recipientStudentId(recipientStudentId)
                .feedbackId(feedbackId)
                .title(title)
                .body(body)
                .build();
    }

    public static Letter broadcast(LetterCategory category, String title, String body) {
        return Letter.builder()
                .category(category)
                .title(title)
                .body(body)
                .build();
    }
}
