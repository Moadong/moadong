package moadong.feedback.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.enums.LetterCategory;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * 발행 전 편지 초안. 발행된 편지({@link Letter})와 다른 컬렉션에 둔다.
 * 같은 컬렉션에 상태 플래그로 섞으면 받은 편지함 쿼리에 조건 하나만 빠져도
 * 쓰다 만 글이 전체 사용자에게 노출되기 때문이다.
 * <p>
 * 초안은 작성 도중 언제든 저장할 수 있어야 하므로 제목 · 본문이 비어 있어도 허용한다.
 */
@Document("feedback_letter_drafts")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LetterDraft {

    @Id
    private String id;

    private LetterCategory category;

    private String title;

    private String body;

    private boolean sendPush;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();

    public void update(LetterCategory category, String title, String body, boolean sendPush) {
        this.category = category;
        this.title = title;
        this.body = body;
        this.sendPush = sendPush;
        this.updatedAt = Instant.now();
    }
}
