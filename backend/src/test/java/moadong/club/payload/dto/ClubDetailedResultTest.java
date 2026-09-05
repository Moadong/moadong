package moadong.club.payload.dto;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubState;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@UnitTest
class ClubDetailedResultTest {

    @ParameterizedTest
    @EnumSource(ClubState.class)
    void state는_설명값이_아닌_enum_이름으로_내려간다(ClubState state) {
        Club club = createClub(state);

        assertThat(ClubDetailedResult.of(club).state()).isEqualTo(state.name());
    }

    @ParameterizedTest
    @EnumSource(ClubState.class)
    void state는_목록_응답과_같은_값을_내려간다(ClubState state) {
        Club club = createClub(state);

        assertThat(ClubDetailedResult.of(club).state())
                .isEqualTo(ClubSearchResult.of(club).state());
    }

    @Test
    void state가_null이면_빈_문자열을_내려간다() {
        Club club = createClub(null);

        assertThat(ClubDetailedResult.of(club).state()).isEmpty();
    }

    private Club createClub(ClubState state) {
        Club club = Club.builder()
                .name("모아동")
                .category("학술")
                .division("중앙")
                .userId("userId")
                .clubRecruitmentInformation(ClubRecruitmentInformation.builder().build())
                .build();
        ReflectionTestUtils.setField(club, "state", state);
        return club;
    }
}
