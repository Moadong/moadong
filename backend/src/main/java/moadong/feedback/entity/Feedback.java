package moadong.feedback.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.feedback.enums.FeedbackStatus;
import moadong.feedback.enums.FeedbackType;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("feedbacks")
@CompoundIndex(name = "student_created_at_idx", def = "{'studentId': 1, 'createdAt': -1}")
@CompoundIndex(name = "created_at_idx", def = "{'createdAt': -1}")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {

    @Id
    private String id;

    /**
     * 운영자 둘이 동시에 답장을 발행하면 늦은 쪽이 충돌하도록 한다.
     * {@code GlobalExceptionHandler}가 이 예외를 409로 변환한다.
     */
    @Version
    private Long version;

    /**
     * 학생 임시 토큰의 sub(UUID). StudentUser 문서가 없을 수도 있으므로 참조 대신 값으로 보관한다.
     * 조회는 항상 최신순 정렬과 함께라 student_created_at_idx가 담당한다.
     */
    private String studentId;

    private FeedbackType type;

    private String content;

    @Builder.Default
    private List<String> images = List.of();

    @Builder.Default
    private FeedbackStatus status = FeedbackStatus.WAITING;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant repliedAt;

    private String replyLetterId;

    public void markReplied(String replyLetterId) {
        this.status = FeedbackStatus.REPLIED;
        this.replyLetterId = replyLetterId;
        this.repliedAt = Instant.now();
    }

    /**
     * 운영자가 답장 대기 · 확인 중 사이를 오갈 때만 쓴다.
     * REPLIED는 replyLetterId · repliedAt과 함께 설정돼야 하므로 {@link #markReplied}로만 전이한다.
     */
    public void changeStatus(FeedbackStatus status) {
        this.status = status;
    }
}
