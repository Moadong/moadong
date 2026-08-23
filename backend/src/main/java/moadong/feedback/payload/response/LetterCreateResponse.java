package moadong.feedback.payload.response;

public record LetterCreateResponse(
        String letterId,
        boolean pushSent,
        // 발송에 성공한 기기 수. 운영자가 실제로 나갔는지 확인할 수 있어야 한다.
        int pushSuccessCount
) {
}
