package moadong.club.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.anthropic.dto.DraftQuestion;
import moadong.anthropic.service.AnthropicQuestionGenerator;
import moadong.club.entity.Club;
import moadong.club.payload.response.ClubApplicationDraftResponse;
import moadong.club.payload.response.ClubApplicationDraftResponse.ItemDto;
import moadong.club.payload.response.ClubApplicationDraftResponse.OptionsDto;
import moadong.club.payload.response.ClubApplicationDraftResponse.QuestionDto;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiApplicationDraftService {

    private static final Set<String> ALLOWED_TYPES =
            Set.of("SHORT_TEXT", "LONG_TEXT", "CHOICE", "MULTI_CHOICE");
    private static final Set<String> CHOICE_TYPES = Set.of("CHOICE", "MULTI_CHOICE");
    private static final int MAX_TITLE = 50;
    private static final int MAX_DESCRIPTION = 300;
    private static final int MAX_ITEM = 20;

    private final ClubRepository clubRepository;
    private final AnthropicQuestionGenerator generator;

    public ClubApplicationDraftResponse generateDraft(CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        List<DraftQuestion> aiQuestions = List.of();
        try {
            aiQuestions = generator.generate(AiDraftPrompts.SYSTEM, AiDraftPrompts.buildUserPrompt(club))
                    .stream()
                    .filter(this::isValid)
                    .toList();
        } catch (Exception e) {
            log.error("AI 지원서 초안 생성 실패, 템플릿으로 폴백. clubName={}", club.getName(), e);
        }

        boolean aiGenerated = !aiQuestions.isEmpty();
        List<QuestionDto> questions = assemble(aiQuestions);
        return new ClubApplicationDraftResponse(
                buildTitle(club), buildDescription(club), questions, aiGenerated);
    }

    private boolean isValid(DraftQuestion q) {
        if (q.title() == null || q.title().isBlank() || q.title().length() > MAX_TITLE) {
            return false;
        }
        if (q.description() != null && q.description().length() > MAX_DESCRIPTION) {
            return false;
        }
        if (q.type() == null || !ALLOWED_TYPES.contains(q.type())) {
            return false;
        }
        List<String> items = q.items() == null ? List.of() : q.items();
        if (CHOICE_TYPES.contains(q.type())) {
            return !items.isEmpty() && items.stream()
                    .allMatch(v -> v != null && !v.isBlank() && v.length() <= MAX_ITEM);
        }
        return true;
    }

    private List<QuestionDto> assemble(List<DraftQuestion> aiQuestions) {
        List<QuestionDto> questions = new ArrayList<>();
        questions.add(new QuestionDto(1, "연락처", "연락 가능한 전화번호를 입력해주세요.",
                "PHONE_NUMBER", new OptionsDto(true), List.of()));
        questions.add(new QuestionDto(2, "학과와 학번을 입력해주세요", "예: 컴퓨터공학과 20학번",
                "SHORT_TEXT", new OptionsDto(true), List.of()));

        long nextId = 3;
        for (DraftQuestion q : aiQuestions) {
            String description = q.description() == null ? "" : q.description();
            List<ItemDto> items = CHOICE_TYPES.contains(q.type())
                    ? q.items().stream().map(ItemDto::new).toList()
                    : List.<ItemDto>of();
            questions.add(new QuestionDto(nextId++, q.title(), description, q.type(),
                    new OptionsDto(q.required()), items));
        }
        return questions;
    }

    private String buildTitle(Club club) {
        String title = club.getName() + " 신입 부원 모집 지원서";
        return title.length() > 50 ? title.substring(0, 50) : title;
    }

    private String buildDescription(Club club) {
        String intro = club.getClubRecruitmentInformation() == null
                ? null : club.getClubRecruitmentInformation().getIntroduction();
        StringBuilder sb = new StringBuilder("안녕하세요, ").append(club.getName()).append("입니다.\n");
        if (intro != null && !intro.isBlank()) {
            sb.append(intro).append("\n");
        }
        sb.append("\n아래 지원서를 작성해 지원해주세요!");
        return sb.toString();
    }
}
