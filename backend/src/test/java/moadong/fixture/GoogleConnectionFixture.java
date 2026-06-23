package moadong.fixture;

import java.time.LocalDateTime;
import moadong.calendar.google.entity.GoogleConnection;

public class GoogleConnectionFixture {

    public static final String DEFAULT_CLUB_ID = "test-club-id";
    public static final String DEFAULT_CALENDAR_ID = "primary";
    public static final String DEFAULT_CALENDAR_NAME = "기본 캘린더";
    public static final String DEFAULT_EMAIL = "test@gmail.com";

    public static GoogleConnection create(String clubId) {
        return GoogleConnection.builder()
                .clubId(clubId)
                .encryptedAccessToken("encrypted-access-token")
                .encryptedRefreshToken("encrypted-refresh-token")
                .calendarId(DEFAULT_CALENDAR_ID)
                .calendarName(DEFAULT_CALENDAR_NAME)
                .email(DEFAULT_EMAIL)
                .tokenExpiresAt(LocalDateTime.now().plusHours(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static GoogleConnection createWithoutCalendar(String clubId) {
        return GoogleConnection.builder()
                .clubId(clubId)
                .encryptedAccessToken("encrypted-access-token")
                .encryptedRefreshToken("encrypted-refresh-token")
                .email(DEFAULT_EMAIL)
                .tokenExpiresAt(LocalDateTime.now().plusHours(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static GoogleConnection createWithExpiredToken(String clubId) {
        return GoogleConnection.builder()
                .clubId(clubId)
                .encryptedAccessToken("encrypted-access-token")
                .encryptedRefreshToken("encrypted-refresh-token")
                .calendarId(DEFAULT_CALENDAR_ID)
                .calendarName(DEFAULT_CALENDAR_NAME)
                .email(DEFAULT_EMAIL)
                .tokenExpiresAt(LocalDateTime.now().minusMinutes(10))
                .updatedAt(LocalDateTime.now())
                .build();
    }
}
