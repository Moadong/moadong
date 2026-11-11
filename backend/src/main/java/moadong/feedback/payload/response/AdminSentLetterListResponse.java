package moadong.feedback.payload.response;

import java.util.List;

public record AdminSentLetterListResponse(
        List<AdminSentLetterResponse> letters
) {
}
