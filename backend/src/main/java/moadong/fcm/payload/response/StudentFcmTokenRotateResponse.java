package moadong.fcm.payload.response;

import java.time.LocalDateTime;

public record StudentFcmTokenRotateResponse(
        String fcmToken,
        boolean replaced,
        LocalDateTime timestamp
) {
}
