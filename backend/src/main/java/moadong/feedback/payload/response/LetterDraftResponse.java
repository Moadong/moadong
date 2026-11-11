package moadong.feedback.payload.response;

import moadong.feedback.entity.LetterDraft;
import moadong.feedback.enums.LetterCategory;

import java.time.Instant;

public record LetterDraftResponse(
        String id,
        LetterCategory category,
        String title,
        String body,
        boolean sendPush,
        Instant updatedAt
) {

    public static LetterDraftResponse from(LetterDraft draft) {
        return new LetterDraftResponse(
                draft.getId(),
                draft.getCategory(),
                draft.getTitle(),
                draft.getBody(),
                draft.isSendPush(),
                draft.getUpdatedAt()
        );
    }
}
