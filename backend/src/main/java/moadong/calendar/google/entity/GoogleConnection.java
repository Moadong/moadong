package moadong.calendar.google.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("google_connections")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleConnection {

    @Id
    private String clubId;

    private String encryptedAccessToken;

    private String encryptedRefreshToken;

    private String calendarId;

    private String calendarName;

    private String email;

    private LocalDateTime tokenExpiresAt;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public void updateTokens(String encryptedAccessToken, String encryptedRefreshToken,
                             String email, LocalDateTime tokenExpiresAt) {
        this.encryptedAccessToken = encryptedAccessToken;
        this.encryptedRefreshToken = encryptedRefreshToken;
        this.email = email;
        this.tokenExpiresAt = tokenExpiresAt;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateAccessToken(String encryptedAccessToken, LocalDateTime tokenExpiresAt) {
        this.encryptedAccessToken = encryptedAccessToken;
        this.tokenExpiresAt = tokenExpiresAt;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateCalendar(String calendarId, String calendarName) {
        this.calendarId = calendarId;
        this.calendarName = calendarName;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isTokenExpired() {
        if (tokenExpiresAt == null) {
            return true;
        }
        return tokenExpiresAt.isBefore(LocalDateTime.now().plusMinutes(5));
    }
}
