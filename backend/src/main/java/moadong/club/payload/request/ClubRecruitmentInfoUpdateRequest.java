package moadong.club.payload.request;

import java.time.Instant;

public record ClubRecruitmentInfoUpdateRequest(
    Instant recruitmentStart,
    Instant recruitmentEnd,
    String recruitmentTarget,
    String externalApplicationUrl,
    Boolean sendNotification
) {

    public boolean shouldSendNotification() {
        return Boolean.TRUE.equals(sendNotification);
    }
}
