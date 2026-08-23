package moadong.feedback.entity;

import moadong.feedback.enums.LetterCategory;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@UnitTest
class LetterPreviewTest {

    private Letter letterWithBody(String body) {
        return Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .title("즐겨찾기한 동아리 알림, 이렇게 준비 중이에요")
                .body(body)
                .build();
    }

    @Test
    void 미리보기는_마크다운_기호_없이_읽히는_문장이어야_한다() {
        String body = """
                **즐겨찾기 알림**, 이렇게 준비 중이에요!
                ![준비 화면](https://cdn.moadong.com/feedback/abc123.png)
                자세한 내용은 [공지](https://moadong.com/notice)를 확인해주세요.
                """;

        assertEquals("즐겨찾기 알림, 이렇게 준비 중이에요! 자세한 내용은 공지를 확인해주세요.",
                letterWithBody(body).preview());
    }

    @Test
    void 본문이_이미지로_시작해도_뒤의_내용이_보인다() {
        String body = """
                ![준비 화면](https://cdn.moadong.com/feedback/abc123.png)
                알림 기능을 준비하고 있어요.
                """;

        assertEquals("알림 기능을 준비하고 있어요.", letterWithBody(body).preview());
    }

    @Test
    void 긴_본문은_60자에서_잘린다() {
        String preview = letterWithBody("가".repeat(100)).preview();

        assertEquals("가".repeat(60) + "...", preview);
    }

    @Test
    void 본문이_없으면_빈_문자열을_반환한다() {
        assertEquals("", letterWithBody(null).preview());
    }

    @Test
    void 이미지만_있는_본문은_URL을_노출하지_않는다() {
        String preview = letterWithBody("![준비 화면](https://cdn.moadong.com/feedback/abc123.png)").preview();

        assertTrue(preview.isEmpty(), "이미지만 있으면 보여줄 문장이 없다. 실제: " + preview);
    }
}
