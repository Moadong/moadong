package moadong.analytics.service;

import com.mongodb.client.result.UpdateResult;
import moadong.analytics.payload.request.ClubDetailDurationRecordRequest;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.bson.BsonString;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@UnitTest
class ClubDetailDurationServiceTest {

    @Mock
    private ClubAnalyticsRecordService clubAnalyticsRecordService;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private StringRedisTemplate stringRedisTemplate;

    @Test
    void 정상_요청이면_세션을_저장하고_daily와_visitor_집계를_증가시킨다() {
        // given
        ClubDetailDurationService service = service();
        ClubDetailDurationRecordRequest request = request(35);
        passRateLimit();
        sessionInserted();
        visitorDailyUpdated();
        Club club = mock(Club.class);
        when(club.getId()).thenReturn("club-id");
        when(club.getName()).thenReturn("테스트동아리");
        when(clubRepository.findById("club-id")).thenReturn(Optional.of(club));

        // when
        service.record(request, "127.0.0.1");

        // then
        verify(clubAnalyticsRecordService).recordDetailDuration(
                "club-id",
                "테스트동아리",
                LocalDate.of(2026, 8, 6),
                35
        );
        verify(mongoTemplate).upsert(any(Query.class), any(Update.class), eq("club_detail_duration_sessions"));
        verify(mongoTemplate).upsert(any(Query.class), any(Update.class), eq("club_detail_visitor_daily"));
    }

    @Test
    void 중복_세션이면_daily_집계를_증가시키지_않는다() {
        // given
        ClubDetailDurationService service = service();
        ClubDetailDurationRecordRequest request = request(10);
        passRateLimit();
        sessionDuplicated();
        Club club = mock(Club.class);
        when(club.getId()).thenReturn("club-id");
        when(clubRepository.findById("club-id")).thenReturn(Optional.of(club));

        // when
        service.record(request, "127.0.0.1");

        // then
        verifyNoInteractions(clubAnalyticsRecordService);
        verify(mongoTemplate).upsert(any(Query.class), any(Update.class), eq("club_detail_duration_sessions"));
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq("club_detail_visitor_daily"));
    }

    @Test
    void daily_집계_실패_시_트랜잭션에_예외를_전파한다() {
        // given
        ClubDetailDurationService service = service();
        ClubDetailDurationRecordRequest request = request(10);
        passRateLimit();
        sessionInserted();
        Club club = mock(Club.class);
        when(club.getId()).thenReturn("club-id");
        when(club.getName()).thenReturn("테스트동아리");
        when(clubRepository.findById("club-id")).thenReturn(Optional.of(club));
        doThrow(new RuntimeException("mongo error"))
                .when(clubAnalyticsRecordService)
                .recordDetailDuration(any(), any(), any(), anyLong());

        // when & then
        assertThrows(RuntimeException.class, () -> service.record(request, "127.0.0.1"));
        verify(mongoTemplate, never()).upsert(any(Query.class), any(Update.class), eq("club_detail_visitor_daily"));
    }

    @Test
    void visitor_집계_실패_시_트랜잭션에_예외를_전파한다() {
        // given
        ClubDetailDurationService service = service();
        ClubDetailDurationRecordRequest request = request(10);
        passRateLimit();
        sessionInserted();
        Club club = mock(Club.class);
        when(club.getId()).thenReturn("club-id");
        when(club.getName()).thenReturn("테스트동아리");
        when(clubRepository.findById("club-id")).thenReturn(Optional.of(club));
        when(mongoTemplate.upsert(any(Query.class), any(Update.class), eq("club_detail_visitor_daily")))
                .thenThrow(new RuntimeException("mongo error"));

        // when & then
        assertThrows(RuntimeException.class, () -> service.record(request, "127.0.0.1"));
        verify(clubAnalyticsRecordService).recordDetailDuration(
                "club-id",
                "테스트동아리",
                LocalDate.of(2026, 8, 6),
                10
        );
    }

    @Test
    void 요청_제한을_초과하면_429_예외가_발생한다() {
        // given
        ClubDetailDurationService service = service();
        when(stringRedisTemplate.execute(any(RedisScript.class), anyList(), anyString()))
                .thenReturn(121L);

        // when & then
        RestApiException exception = assertThrows(
                RestApiException.class,
                () -> service.record(request(10), "127.0.0.1")
        );
        assertEquals(ErrorCode.STATISTICS_EVENT_RATE_LIMITED, exception.getErrorCode());
        verifyNoInteractions(clubRepository);
    }

    @Test
    void duration이_범위를_벗어나면_실패한다() {
        // given
        ClubDetailDurationService service = service();

        // when & then
        assertThrows(RestApiException.class, () -> service.record(request(0), "127.0.0.1"));
        assertThrows(RestApiException.class, () -> service.record(request(3601), "127.0.0.1"));
        verifyNoInteractions(clubRepository);
        verifyNoInteractions(stringRedisTemplate);
    }

    @Test
    void leftAt이_enteredAt보다_이전이면_실패한다() {
        // given
        ClubDetailDurationService service = service();
        ClubDetailDurationRecordRequest request = new ClubDetailDurationRecordRequest(
                "club-id",
                "테스트동아리",
                "session-id",
                "visitor-id",
                Instant.parse("2026-08-06T01:00:10Z"),
                Instant.parse("2026-08-06T01:00:00Z"),
                10L
        );

        // when & then
        assertThrows(RestApiException.class, () -> service.record(request, "127.0.0.1"));
        verifyNoInteractions(clubRepository);
        verifyNoInteractions(stringRedisTemplate);
    }

    private ClubDetailDurationService service() {
        return new ClubDetailDurationService(
                clubAnalyticsRecordService,
                clubRepository,
                mongoTemplate,
                stringRedisTemplate
        );
    }

    private void passRateLimit() {
        when(stringRedisTemplate.execute(any(RedisScript.class), anyList(), anyString()))
                .thenReturn(1L);
    }

    private void sessionInserted() {
        when(mongoTemplate.upsert(any(Query.class), any(Update.class), eq("club_detail_duration_sessions")))
                .thenReturn(UpdateResult.acknowledged(0L, 0L, new BsonString("session-doc-id")));
    }

    private void sessionDuplicated() {
        when(mongoTemplate.upsert(any(Query.class), any(Update.class), eq("club_detail_duration_sessions")))
                .thenReturn(UpdateResult.acknowledged(1L, 0L, null));
    }

    private void visitorDailyUpdated() {
        when(mongoTemplate.upsert(any(Query.class), any(Update.class), eq("club_detail_visitor_daily")))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));
    }

    private ClubDetailDurationRecordRequest request(long durationSeconds) {
        return new ClubDetailDurationRecordRequest(
                "club-id",
                "테스트동아리",
                "session-id",
                "visitor-id",
                Instant.parse("2026-08-06T01:00:00Z"),
                Instant.parse("2026-08-06T01:00:35Z"),
                durationSeconds
        );
    }
}
