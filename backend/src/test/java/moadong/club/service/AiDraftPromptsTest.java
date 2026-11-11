package moadong.club.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubDescription;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@UnitTest
class AiDraftPromptsTest {

    private Club mockClub(ClubRecruitmentInformation info, ClubDescription desc) {
        Club club = mock(Club.class);
        when(club.getName()).thenReturn("매니아");
        when(club.getCategory()).thenReturn("공연");
        when(club.getDivision()).thenReturn("중동");
        when(club.getClubRecruitmentInformation()).thenReturn(info);
        when(club.getClubDescription()).thenReturn(desc);
        return club;
    }

    @Test
    @DisplayName("동아리 정보가 모두 있으면 프롬프트에 각 항목이 포함된다")
    void buildUserPrompt_withFullInfo() {
        Club club = mockClub(
                ClubRecruitmentInformation.builder()
                        .introduction("부경대 락밴드 동아리")
                        .tags(List.of("락밴드", "다양한장르"))
                        .build(),
                ClubDescription.builder()
                        .introDescription("얼터너티브, 개러지, 펑크 등 다양한 장르를 시도합니다.")
                        .activityDescription("연 2회 정기공연을 준비합니다.")
                        .benefits("무대 경험")
                        .build());

        String prompt = AiDraftPrompts.buildUserPrompt(club);

        assertThat(prompt).contains("매니아");
        assertThat(prompt).contains("중동 / 공연");
        assertThat(prompt).contains("락밴드, 다양한장르");
        assertThat(prompt).contains("부경대 락밴드 동아리");
        assertThat(prompt).contains("연 2회 정기공연");
        assertThat(prompt).contains("무대 경험");
    }

    @Test
    @DisplayName("null이거나 비어있는 필드는 (없음)으로 표기된다")
    void buildUserPrompt_withMissingInfo() {
        Club club = mockClub(
                ClubRecruitmentInformation.builder().build(),
                null);

        String prompt = AiDraftPrompts.buildUserPrompt(club);

        assertThat(prompt).contains("(없음)");
        assertThat(prompt).doesNotContain("null");
    }
}
