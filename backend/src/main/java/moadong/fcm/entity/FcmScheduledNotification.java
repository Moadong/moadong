package moadong.fcm.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Getter
@Builder(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Document("fcm_scheduled_notifications")
@CompoundIndex(name = "idx_fcm_schedule_status_scheduled_at", def = "{'status': 1, 'scheduledAt': 1}")
public class FcmScheduledNotification {

    @Id
    private String id;
    private FcmScheduleTargetType targetType;
    private String token;
    private String title;
    private String body;
    @Builder.Default
    private Map<String, String> data = new LinkedHashMap<>();
    private Instant scheduledAt;
    private FcmScheduleStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private Instant sendingStartedAt;
    private Instant canceledAt;
    private Instant sentAt;
    private String failureReason;
    private String messageId;
    private int totalCount;
    private int successCount;
    private int failureCount;
    @Builder.Default
    private List<String> failedTokens = new ArrayList<>();

    public static FcmScheduledNotification create(
            FcmScheduleTargetType targetType,
            String token,
            String title,
            String body,
            Map<String, String> data,
            Instant scheduledAt
    ) {
        return FcmScheduledNotification.builder()
                .targetType(targetType)
                .token(targetType == FcmScheduleTargetType.SINGLE_TOKEN ? token : null)
                .title(title)
                .body(body)
                .data(safeData(data))
                .scheduledAt(scheduledAt)
                .status(FcmScheduleStatus.SCHEDULED)
                .createdAt(Instant.now())
                .failedTokens(new ArrayList<>())
                .build();
    }

    public void markSending(Instant now) {
        this.status = FcmScheduleStatus.SENDING;
        this.sendingStartedAt = now;
        this.updatedAt = now;
    }

    public void markSingleSent(String messageId, Instant sentAt) {
        this.status = FcmScheduleStatus.SENT;
        this.messageId = messageId;
        this.totalCount = 1;
        this.successCount = 1;
        this.failureCount = 0;
        this.sentAt = sentAt;
        this.updatedAt = sentAt;
        this.failureReason = null;
        this.failedTokens = new ArrayList<>();
    }

    public void markSingleFailed(String failureReason, Instant now) {
        this.status = FcmScheduleStatus.FAILED;
        this.totalCount = 1;
        this.successCount = 0;
        this.failureCount = 1;
        this.failureReason = failureReason;
        this.updatedAt = now;
    }

    public void markBatchSent(int totalCount, int successCount, int failureCount, List<String> failedTokens, Instant sentAt) {
        this.status = FcmScheduleStatus.SENT;
        this.totalCount = totalCount;
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.failedTokens = failedTokens == null ? new ArrayList<>() : new ArrayList<>(failedTokens);
        this.sentAt = sentAt;
        this.updatedAt = sentAt;
        this.failureReason = null;
    }

    public void markFailed(String failureReason, Instant now) {
        this.status = FcmScheduleStatus.FAILED;
        this.failureReason = StringUtils.hasText(failureReason) ? failureReason : "FCM 예약 알림 발송에 실패했습니다.";
        this.updatedAt = now;
    }

    public void cancel(Instant canceledAt) {
        this.status = FcmScheduleStatus.CANCELED;
        this.canceledAt = canceledAt;
        this.updatedAt = canceledAt;
    }

    public boolean isCancelable() {
        return this.status == FcmScheduleStatus.SCHEDULED;
    }

    private static Map<String, String> safeData(Map<String, String> data) {
        if (data == null || data.isEmpty()) {
            return new LinkedHashMap<>();
        }
        return new LinkedHashMap<>(data);
    }
}
