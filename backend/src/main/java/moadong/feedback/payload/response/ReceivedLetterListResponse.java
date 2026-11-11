package moadong.feedback.payload.response;

import java.util.List;

public record ReceivedLetterListResponse(
        List<ReceivedLetterSummaryResponse> letters
) {
}
