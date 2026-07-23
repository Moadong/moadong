package moadong.club.service;

import java.time.Duration;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.anthropic.dto.DraftQuestion;
import moadong.anthropic.service.AnthropicQuestionGenerator;
import moadong.club.entity.Club;
import moadong.club.payload.response.ClubAiDraftQuotaResponse;
import moadong.club.payload.response.ClubApplicationDraftResponse;
import moadong.club.payload.response.ClubApplicationDraftResponse.ItemDto;
import moadong.club.payload.response.ClubApplicationDraftResponse.OptionsDto;
import moadong.club.payload.response.ClubApplicationDraftResponse.QuestionDto;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
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

    // 동아리당 월 AI 초안 생성 한도 (Anthropic API 비용 방어)
    private static final int MONTHLY_LIMIT = 3;
    // 오래된 월별 카운터 키 자동 청소용 TTL (정확한 월말 계산 불필요)
    private static final Duration KEY_TTL = Duration.ofDays(62);
    private static final String COUNT_KEY_PREFIX = "ai-draft:count:";
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    // INCR + 첫 증가 시 조건부 EXPIRE를 원자적으로 수행 (TTL 누락 방지)
    private static final RedisScript<Long> COUNT_SCRIPT = RedisScript.of(
            "local c = redis.call('INCR', KEYS[1])\n" +
            "if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end\n" +
            "return c",
            Long.class
    );

    private final ClubRepository clubRepository;
    private final AnthropicQuestionGenerator generator;
    private final StringRedisTemplate stringRedisTemplate;

    public ClubApplicationDraftResponse generateDraft(CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        long used = incrementMonthlyUsage(club.getId());
        if (used > MONTHLY_LIMIT) {
            log.warn("AI 초안 생성 월 한도({}회) 초과로 차단. clubId={}, used={}",
                    MONTHLY_LIMIT, club.getId(), used);
            throw new RestApiException(ErrorCode.AI_DRAFT_LIMIT_EXCEEDED);
        }

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
        int remaining = (int) Math.max(0, MONTHLY_LIMIT - used);
        return new ClubApplicationDraftResponse(
                buildTitle(club), buildDescription(club), questions, aiGenerated, remaining);
    }

    public ClubAiDraftQuotaResponse getQuota(CustomUserDetails user) {
        Club club = clubRepository.findClubByUserId(user.getId())
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        long used = readMonthlyUsage(club.getId());
        int remaining = (int) Math.max(0, MONTHLY_LIMIT - used);
        return new ClubAiDraftQuotaResponse(MONTHLY_LIMIT, (int) used, remaining);
    }

    private String monthlyKey(String clubId) {
        return COUNT_KEY_PREFIX + clubId + ":" + YearMonth.now(KST);
    }

    // 월별 카운터를 원자적으로 1 증가시키고 증가 후 값을 반환한다.
    // Redis 장애 시에는 가용성을 우선해 로그만 남기고 0을 반환하여 제한 없이 통과시킨다.
    private long incrementMonthlyUsage(String clubId) {
        try {
            Long count = stringRedisTemplate.execute(
                    COUNT_SCRIPT,
                    List.of(monthlyKey(clubId)),
                    String.valueOf(KEY_TTL.getSeconds()));
            return count == null ? 0L : count;
        } catch (Exception e) {
            log.warn("AI 초안 생성 카운트 실패, 제한 없이 통과. clubId={}", clubId, e);
            return 0L;
        }
    }

    // 카운터를 증가시키지 않고 현재 사용 횟수만 읽는다 (quota 조회용).
    // Redis 장애 시에는 0으로 처리하여 조회가 실패하지 않도록 한다.
    private long readMonthlyUsage(String clubId) {
        try {
            String value = stringRedisTemplate.opsForValue().get(monthlyKey(clubId));
            return value == null ? 0L : Long.parseLong(value);
        } catch (Exception e) {
            log.warn("AI 초안 quota 조회 실패, 0으로 처리. clubId={}", clubId, e);
            return 0L;
        }
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
