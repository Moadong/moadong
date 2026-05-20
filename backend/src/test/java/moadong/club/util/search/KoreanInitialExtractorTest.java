package moadong.club.util.search;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class KoreanInitialExtractorTest {

    private final KoreanInitialExtractor extractor = new KoreanInitialExtractor();

    @Test
    void 한글_초성을_추출한다() {
        assertEquals("ㅍㄹㅇㅇㅅ", extractor.extractInitials("플레이어스"));
    }

    @Test
    void 한글이_아닌_문자는_그대로_둔다() {
        assertEquals("PKNUㅇㄱ", extractor.extractInitials("PKNU야구"));
    }

    @Test
    void 빈_문자열을_처리한다() {
        assertEquals("", extractor.extractInitials(""));
    }
}
