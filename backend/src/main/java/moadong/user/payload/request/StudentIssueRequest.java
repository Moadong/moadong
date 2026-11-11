package moadong.user.payload.request;

import jakarta.validation.constraints.Pattern;
import java.util.Locale;
import java.util.UUID;
import moadong.global.RegexConstants;

public record StudentIssueRequest(
        @Pattern(regexp = RegexConstants.UUID_V4, message = "sub는 UUIDv4 형식이어야 합니다.")
        String sub
) {

    /**
     * 재발급 요청의 sub를 studentId로 되돌린다.
     * 본문이 없거나(이미 배포된 웹) sub가 없으면 새 신원을 만들고,
     * sub가 있으면 소문자로 정규화해 같은 신원을 유지한다.
     * (Feedback.studentId는 문자열 그대로 비교하므로 대소문자가 갈리면 편지함이 둘로 나뉜다.)
     */
    public static String resolveStudentId(StudentIssueRequest request) {
        if (request == null || request.sub() == null) {
            return UUID.randomUUID().toString();
        }
        return request.sub().toLowerCase(Locale.ROOT);
    }
}
