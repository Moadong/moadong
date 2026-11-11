package moadong.feedback.payload.response;

import java.util.List;

public record AdminFeedbackListResponse(
        List<AdminFeedbackResponse> feedbacks,
        // 사이드바 뱃지에 쓰이는 미답변(답장 완료가 아닌) 개수
        long unansweredCount
) {
}
