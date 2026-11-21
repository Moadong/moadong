package moadong.feedback.payload.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@UnitTest
class FeedbackReplyRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void requestId가_있으면_검증을_통과한다() {
        Set<ConstraintViolation<FeedbackReplyRequest>> violations =
                validator.validate(new FeedbackReplyRequest("제목", "본문", true, "req-1", null));

        assertTrue(violations.isEmpty());
    }

    // 이미 답장한 피드백에도 답장할 수 있어서, 키 없는 요청은 중복 발행을 막을 방법이 없다.
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void requestId가_없으면_검증에_실패한다(String requestId) {
        Set<ConstraintViolation<FeedbackReplyRequest>> violations =
                validator.validate(new FeedbackReplyRequest("제목", "본문", true, requestId, null));

        assertEquals(1, violations.size());
        assertEquals("requestId", violations.iterator().next().getPropertyPath().toString());
    }
}
