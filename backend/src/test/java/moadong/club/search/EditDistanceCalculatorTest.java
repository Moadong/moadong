package moadong.club.search;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class EditDistanceCalculatorTest {

    private final EditDistanceCalculator calculator = new EditDistanceCalculator();

    @Test
    void 편집거리를_계산한다() {
        assertEquals(1, calculator.distance("야규", "야구"));
        assertEquals(0, calculator.distance("야구", "야구"));
    }

    @Test
    void 동아리명_prefix_window와의_최소_거리를_계산한다() {
        assertEquals(1, calculator.minDistanceAgainstName("야규", "야구부"));
    }
}
