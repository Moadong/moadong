package moadong.club.util;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@UnitTest
class RecruitmentStateCalculatorTest {

    private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");

    @InjectMocks
    private RecruitmentStateCalculator recruitmentStateCalculator;

    @Test
    void calculate_모집상태가_변경되면_true를_반환하고_상태를_갱신한다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);

        Club club = createClub(ClubRecruitmentStatus.CLOSED, start, end);
        boolean changed = recruitmentStateCalculator.calculate(club, start, end);

        assertThat(changed).isTrue();
        assertThat(club.getClubRecruitmentInformation().getClubRecruitmentStatus())
                .isEqualTo(ClubRecruitmentStatus.OPEN);
    }

    @Test
    void calculate_모집상태가_변경되지_않으면_false를_반환한다() {
        ZonedDateTime now = ZonedDateTime.now(SEOUL_ZONE);
        ZonedDateTime start = now.minusDays(1);
        ZonedDateTime end = now.plusDays(2);

        Club club = createClub(ClubRecruitmentStatus.OPEN, start, end);

        boolean changed = recruitmentStateCalculator.calculate(club, start, end);

        assertThat(changed).isFalse();
        assertThat(club.getClubRecruitmentInformation().getClubRecruitmentStatus())
                .isEqualTo(ClubRecruitmentStatus.OPEN);
    }

    private Club createClub(ClubRecruitmentStatus status, ZonedDateTime recruitmentStart, ZonedDateTime recruitmentEnd) {
        ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
                .clubRecruitmentStatus(status)
                .recruitmentStart(recruitmentStart.toInstant())
                .recruitmentEnd(recruitmentEnd.toInstant())
                .build();

        return new Club(
                "club-id",
                "테스트 동아리",
                "category",
                "division",
                null,
                null,
                null,
                info,
                null,
                null
        );
    }
}
