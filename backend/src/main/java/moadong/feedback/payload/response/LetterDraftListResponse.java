package moadong.feedback.payload.response;

import java.util.List;

public record LetterDraftListResponse(
        List<LetterDraftResponse> drafts
) {
}
