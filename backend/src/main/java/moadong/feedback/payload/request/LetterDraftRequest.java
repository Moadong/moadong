package moadong.feedback.payload.request;

import moadong.feedback.enums.LetterCategory;

/**
 * 초안은 작성 도중 저장되므로 필수값 검증을 두지 않는다. 검증은 발행 시점에 한다.
 */
public record LetterDraftRequest(
        LetterCategory category,
        String title,
        String body,
        boolean sendPush
) {
}
