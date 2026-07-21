package moadong.club.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import moadong.anthropic.dto.DraftQuestion;
import moadong.anthropic.service.AnthropicQuestionGenerator;
import moadong.club.entity.Club;
import moadong.club.payload.response.ClubApplicationDraftResponse;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@UnitTest
class AiApplicationDraftServiceTest {

    private ClubRepository clubRepository;
    private AnthropicQuestionGenerator generator;
    private AiApplicationDraftService service;
    private CustomUserDetails user;

    @BeforeEach
    void setUp() {
        clubRepository = mock(ClubRepository.class);
        generator = mock(AnthropicQuestionGenerator.class);
        service = new AiApplicationDraftService(clubRepository, generator);

        user = mock(CustomUserDetails.class);
        Club club = mock(Club.class);
        lenient().when(club.getName()).thenReturn("매니아");
        when(user.getId()).thenReturn("user-1");
        lenient().when(clubRepository.findClubByUserId("user-1")).thenReturn(Optional.of(club));
    }

    private DraftQuestion validQuestion(String title) {
        return new DraftQuestion(title, "설명", "LONG_TEXT", List.of(), true);
    }

    @Test
    @DisplayName("AI 생성 성공 시 템플릿 2문항 + AI 문항이 순번 id로 조립된다")
    void generateDraft_success() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(
                validQuestion("지원 동기를 알려주세요"),
                new DraftQuestion("선호하는 활동은?", "", "CHOICE", List.of("공연", "연습"), true),
                validQuestion("밴드 경험이 있나요?")));

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isTrue();
        assertThat(response.questions()).hasSize(5); // 연락처 + 학과/학번 + AI 3
        assertThat(response.questions().get(0).type()).isEqualTo("PHONE_NUMBER");
        assertThat(response.questions()).extracting("id").containsExactly(1L, 2L, 3L, 4L, 5L);
        assertThat(response.title()).contains("매니아");
    }

    @Test
    @DisplayName("AI 호출이 실패하면 템플릿 문항만으로 aiGenerated=false 응답한다")
    void generateDraft_fallbackOnApiError() {
        when(generator.generate(anyString(), anyString()))
                .thenThrow(new IllegalStateException("api down"));

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isFalse();
        assertThat(response.questions()).hasSize(2);
    }

    @Test
    @DisplayName("검증에 걸리는 AI 문항은 제외된다 (title 50자 초과, CHOICE인데 items 없음, 허용 외 type)")
    void generateDraft_filtersInvalidQuestions() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(
                validQuestion("정상 질문"),
                validQuestion("가".repeat(51)),
                new DraftQuestion("선택지 없는 객관식", "", "CHOICE", List.of(), true),
                new DraftQuestion("허용 외 타입", "", "NAME", List.of(), true)));

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isTrue();
        assertThat(response.questions()).hasSize(3); // 템플릿 2 + 정상 1
    }

    @Test
    @DisplayName("AI 문항이 전부 걸러지면 폴백으로 처리한다")
    void generateDraft_fallbackWhenAllFiltered() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(
                new DraftQuestion("선택지 없는 객관식", "", "CHOICE", List.of(), true)));

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isFalse();
        assertThat(response.questions()).hasSize(2);
    }

    @Test
    @DisplayName("동아리가 없으면 RestApiException")
    void generateDraft_clubNotFound() {
        when(clubRepository.findClubByUserId("user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.generateDraft(user))
                .isInstanceOf(RestApiException.class);
    }
}
