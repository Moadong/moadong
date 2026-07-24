package moadong.club.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import moadong.anthropic.dto.DraftQuestion;
import moadong.anthropic.service.AnthropicQuestionGenerator;
import moadong.club.entity.Club;
import moadong.club.payload.response.ClubAiDraftQuotaResponse;
import moadong.club.payload.response.ClubApplicationDraftResponse;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.script.RedisScript;

@UnitTest
class AiApplicationDraftServiceTest {

    private ClubRepository clubRepository;
    private AnthropicQuestionGenerator generator;
    private StringRedisTemplate stringRedisTemplate;
    private ValueOperations<String, String> valueOps;
    private AiApplicationDraftService service;
    private CustomUserDetails user;
    private Club club;

    @BeforeEach
    void setUp() {
        clubRepository = mock(ClubRepository.class);
        generator = mock(AnthropicQuestionGenerator.class);
        stringRedisTemplate = mock(StringRedisTemplate.class);
        service = new AiApplicationDraftService(clubRepository, generator, stringRedisTemplate);

        user = mock(CustomUserDetails.class);
        club = mock(Club.class);
        lenient().when(club.getName()).thenReturn("매니아");
        lenient().when(club.getId()).thenReturn("club-1");
        when(user.getId()).thenReturn("user-1");
        lenient().when(clubRepository.findClubByUserId("user-1")).thenReturn(Optional.of(club));

        // 기본: 한도 이내(첫 호출) 로 통과
        lenient().when(stringRedisTemplate.execute(any(RedisScript.class), anyList(), anyString()))
                .thenReturn(1L);

        // 폴백 환불(DECR)용 기본 스텁
        valueOps = mock(ValueOperations.class);
        lenient().when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        lenient().when(valueOps.decrement(anyString())).thenReturn(0L);
    }

    private DraftQuestion validQuestion(String title) {
        return new DraftQuestion(title, "설명", "LONG_TEXT", List.of(), true);
    }

    @Test
    @DisplayName("AI 생성 성공 시 템플릿 2문항 + AI 문항이 순번 id로 조립되고 남은 횟수를 내려준다")
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
        assertThat(response.remaining()).isEqualTo(2); // 3 - 1회 사용
        verify(valueOps, times(0)).decrement(anyString()); // 성공 시 환불 없음
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
    @DisplayName("동아리가 없으면 카운트 증가 전에 RestApiException")
    void generateDraft_clubNotFound() {
        when(clubRepository.findClubByUserId("user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.generateDraft(user))
                .isInstanceOf(RestApiException.class);

        verify(stringRedisTemplate, times(0)).execute(any(RedisScript.class), anyList(), anyString());
    }

    @Test
    @DisplayName("월 한도(3회)를 넘어선 4번째 요청은 429로 차단되고 Anthropic을 호출하지 않는다")
    void generateDraft_blocksAndSkipsAnthropicWhenLimitExceeded() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(validQuestion("질문")));
        when(stringRedisTemplate.execute(any(RedisScript.class), anyList(), anyString()))
                .thenReturn(1L, 2L, 3L, 4L);

        for (int i = 0; i < 3; i++) {
            assertThat(service.generateDraft(user)).isNotNull();
        }

        assertThatThrownBy(() -> service.generateDraft(user))
                .isInstanceOf(RestApiException.class)
                .satisfies(e -> assertThat(((RestApiException) e).getErrorCode())
                        .isEqualTo(ErrorCode.AI_DRAFT_LIMIT_EXCEEDED));

        // 4번째 요청에서는 실제 Anthropic 호출이 없어야 한다 (비용 방어)
        verify(generator, times(3)).generate(anyString(), anyString());
    }

    @Test
    @DisplayName("카운터 키는 clubId와 연월을 포함하고 62일 TTL 인자로 증가시킨다")
    void generateDraft_incrementsClubScopedMonthlyKeyWithTtl() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(validQuestion("질문")));

        service.generateDraft(user);

        ArgumentCaptor<List> keys = ArgumentCaptor.forClass(List.class);
        ArgumentCaptor<String> ttl = ArgumentCaptor.forClass(String.class);
        verify(stringRedisTemplate).execute(any(RedisScript.class), keys.capture(), ttl.capture());

        String expectedKey = "ai-draft:count:club-1:" + YearMonth.now(ZoneId.of("Asia/Seoul"));
        assertThat(keys.getValue()).containsExactly(expectedKey);
        assertThat(ttl.getValue()).isEqualTo(String.valueOf(Duration.ofDays(62).getSeconds()));
    }

    @Test
    @DisplayName("서로 다른 동아리는 독립된 카운터 키를 사용한다")
    void generateDraft_usesIndependentKeyPerClub() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(validQuestion("질문")));

        CustomUserDetails otherUser = mock(CustomUserDetails.class);
        Club otherClub = mock(Club.class);
        when(otherUser.getId()).thenReturn("user-2");
        lenient().when(otherClub.getName()).thenReturn("다른동아리");
        when(otherClub.getId()).thenReturn("club-2");
        when(clubRepository.findClubByUserId("user-2")).thenReturn(Optional.of(otherClub));

        service.generateDraft(user);
        service.generateDraft(otherUser);

        ArgumentCaptor<List> keys = ArgumentCaptor.forClass(List.class);
        verify(stringRedisTemplate, times(2))
                .execute(any(RedisScript.class), keys.capture(), anyString());

        String month = YearMonth.now(ZoneId.of("Asia/Seoul")).toString();
        assertThat(keys.getAllValues().get(0)).containsExactly("ai-draft:count:club-1:" + month);
        assertThat(keys.getAllValues().get(1)).containsExactly("ai-draft:count:club-2:" + month);
    }

    @Test
    @DisplayName("Anthropic 실패로 폴백이 나가면 소모한 횟수를 환불한다(DECR)")
    void generateDraft_refundsOnFallback() {
        when(generator.generate(anyString(), anyString()))
                .thenThrow(new IllegalStateException("api down"));
        String key = "ai-draft:count:club-1:" + YearMonth.now(ZoneId.of("Asia/Seoul"));
        when(valueOps.decrement(key)).thenReturn(0L);

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isFalse();
        // 증가는 1회(원자적 한도 방어), 이후 환불로 소모 0
        verify(stringRedisTemplate, times(1)).execute(any(RedisScript.class), anyList(), anyString());
        verify(valueOps, times(1)).decrement(key);
        assertThat(response.remaining()).isEqualTo(3);
    }

    @Test
    @DisplayName("Redis 장애로 카운트가 통과된 상태에서 폴백이 나가도 환불 DECR을 호출하지 않는다")
    void generateDraft_noRefundWhenCountBypassed() {
        when(stringRedisTemplate.execute(any(RedisScript.class), anyList(), anyString()))
                .thenThrow(new RuntimeException("redis down"));
        when(generator.generate(anyString(), anyString()))
                .thenThrow(new IllegalStateException("api down"));

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isFalse();
        verify(valueOps, times(0)).decrement(anyString());
        assertThat(response.remaining()).isEqualTo(3);
    }

    @Test
    @DisplayName("Redis 장애 시 제한을 무시하고 생성을 통과시킨다 (가용성 우선)")
    void generateDraft_passesThroughOnRedisFailure() {
        when(generator.generate(anyString(), anyString())).thenReturn(List.of(validQuestion("질문")));
        when(stringRedisTemplate.execute(any(RedisScript.class), anyList(), anyString()))
                .thenThrow(new RuntimeException("redis down"));

        ClubApplicationDraftResponse response = service.generateDraft(user);

        assertThat(response.aiGenerated()).isTrue();
        assertThat(response.remaining()).isEqualTo(3);
    }

    @Test
    @DisplayName("quota 조회 시 저장된 사용 횟수로 limit/used/remaining을 계산하고 카운트를 증가시키지 않는다")
    void getQuota_returnsUsageWithoutIncrementing() {
        ValueOperations<String, String> valueOps = mock(ValueOperations.class);
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        String key = "ai-draft:count:club-1:" + YearMonth.now(ZoneId.of("Asia/Seoul"));
        when(valueOps.get(key)).thenReturn("2");

        ClubAiDraftQuotaResponse quota = service.getQuota(user);

        assertThat(quota.limit()).isEqualTo(3);
        assertThat(quota.used()).isEqualTo(2);
        assertThat(quota.remaining()).isEqualTo(1);
        // 조회는 INCR 스크립트를 호출하지 않아야 한다
        verify(stringRedisTemplate, times(0)).execute(any(RedisScript.class), anyList(), anyString());
    }

    @Test
    @DisplayName("quota 조회 시 키가 없으면 used=0, remaining=limit")
    void getQuota_defaultsToFullQuotaWhenNoKey() {
        ValueOperations<String, String> valueOps = mock(ValueOperations.class);
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get(anyString())).thenReturn(null);

        ClubAiDraftQuotaResponse quota = service.getQuota(user);

        assertThat(quota.used()).isEqualTo(0);
        assertThat(quota.remaining()).isEqualTo(3);
    }

    @Test
    @DisplayName("quota 조회 시 동아리가 없으면 RestApiException")
    void getQuota_clubNotFound() {
        when(clubRepository.findClubByUserId("user-1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getQuota(user))
                .isInstanceOf(RestApiException.class);
    }
}
