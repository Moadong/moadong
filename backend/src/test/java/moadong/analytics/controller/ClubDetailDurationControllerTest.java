package moadong.analytics.controller;

import jakarta.servlet.http.HttpServletRequest;
import moadong.analytics.payload.request.ClubDetailDurationRecordRequest;
import moadong.analytics.service.ClubDetailDurationService;
import moadong.global.payload.Response;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class ClubDetailDurationControllerTest {

    @Mock
    private ClubDetailDurationService clubDetailDurationService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private ClubDetailDurationController clubDetailDurationController;

    @Test
    void 체류_시간_기록_요청은_200과_공통_응답을_반환한다() {
        // given
        ClubDetailDurationRecordRequest request = new ClubDetailDurationRecordRequest(
                "club-id",
                "테스트동아리",
                "session-id",
                "visitor-id",
                Instant.parse("2026-08-06T01:00:00Z"),
                Instant.parse("2026-08-06T01:00:10Z"),
                10L
        );
        when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 10.0.0.1");

        // when
        ResponseEntity<?> response = clubDetailDurationController.recordDuration(request, httpServletRequest);

        // then
        assertEquals(200, response.getStatusCode().value());
        assertEquals("200", ((Response<?>) response.getBody()).statuscode());
        verify(clubDetailDurationService).record(request, "203.0.113.1");
    }

    @Test
    void 비정상적으로_긴_X_Forwarded_For_값은_무시하고_remoteAddr을_사용한다() {
        // given
        ClubDetailDurationRecordRequest request = new ClubDetailDurationRecordRequest(
                "club-id",
                "테스트동아리",
                "session-id",
                "visitor-id",
                Instant.parse("2026-08-06T01:00:00Z"),
                Instant.parse("2026-08-06T01:00:10Z"),
                10L
        );
        when(httpServletRequest.getHeader("X-Forwarded-For")).thenReturn("x".repeat(500));
        when(httpServletRequest.getRemoteAddr()).thenReturn("10.0.0.1");

        // when
        clubDetailDurationController.recordDuration(request, httpServletRequest);

        // then
        verify(clubDetailDurationService).record(request, "10.0.0.1");
    }
}
