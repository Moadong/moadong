package moadong.club.payload.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@UnitTest
class PromotionArticleUpdateRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void 이미지가_빈_목록이어도_검증을_통과한다() {
        Set<ConstraintViolation<PromotionArticleUpdateRequest>> violations = validator.validate(updateRequest(List.of()));

        assertTrue(violations.isEmpty());
    }

    @Test
    void 이미지가_null이면_검증에_실패한다() {
        Set<ConstraintViolation<PromotionArticleUpdateRequest>> violations = validator.validate(updateRequest(null));

        assertEquals(1, violations.size());
        assertEquals("images", violations.iterator().next().getPropertyPath().toString());
    }

    private static PromotionArticleUpdateRequest updateRequest(List<String> images) {
        return new PromotionArticleUpdateRequest(
            "club-1",
            "수정 제목",
            "수정 장소",
            37.5665,
            126.9780,
            Instant.parse("2026-04-01T00:00:00Z"),
            Instant.parse("2026-04-10T00:00:00Z"),
            "수정 설명",
            images
        );
    }
}
