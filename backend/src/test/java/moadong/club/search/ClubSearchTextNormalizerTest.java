package moadong.club.search;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ClubSearchTextNormalizerTest {

    private final ClubSearchTextNormalizer normalizer = new ClubSearchTextNormalizer();

    @Test
    void null은_빈_문자열로_정규화한다() {
        assertEquals("", normalizer.normalize(null));
    }

    @Test
    void 공백을_제거하고_소문자로_정규화한다() {
        assertEquals("playclub", normalizer.normalize("  Play Club "));
        assertEquals("야구", normalizer.normalize("야 구"));
    }
}
