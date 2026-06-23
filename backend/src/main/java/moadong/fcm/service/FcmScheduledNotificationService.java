package moadong.fcm.service;

import lombok.RequiredArgsConstructor;
import moadong.fcm.entity.FcmScheduledNotification;
import moadong.fcm.enums.FcmScheduleStatus;
import moadong.fcm.enums.FcmScheduleTargetType;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.payload.request.FcmScheduleCreateRequest;
import moadong.fcm.payload.response.FcmScheduleCancelResponse;
import moadong.fcm.payload.response.FcmScheduleDetailResponse;
import moadong.fcm.payload.response.FcmScheduleSummaryResponse;
import moadong.fcm.repository.FcmScheduledNotificationRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FcmScheduledNotificationService {

    private final FcmScheduledNotificationRepository repository;

    public FcmScheduleDetailResponse create(FcmScheduleCreateRequest request) {
        validateCreateRequest(request);

        FcmScheduledNotification schedule = FcmScheduledNotification.create(
                request.targetType(),
                request.token(),
                request.title().trim(),
                request.body().trim(),
                sanitizeData(request.data()),
                request.scheduledAt().toInstant()
        );

        return FcmScheduleDetailResponse.from(repository.save(schedule));
    }

    public List<FcmScheduleSummaryResponse> getSchedules(FcmScheduleStatus status) {
        List<FcmScheduledNotification> schedules = status == null
                ? repository.findAllByOrderByScheduledAtDesc()
                : repository.findByStatusOrderByScheduledAtDesc(status);

        return schedules.stream()
                .map(FcmScheduleSummaryResponse::from)
                .toList();
    }

    public FcmScheduleDetailResponse getSchedule(String scheduleId) {
        return FcmScheduleDetailResponse.from(findSchedule(scheduleId));
    }

    public FcmScheduleCancelResponse cancel(String scheduleId) {
        Instant now = Instant.now();
        Optional<FcmScheduledNotification> canceled = repository.cancelIfScheduled(scheduleId, now);
        if (canceled.isPresent()) {
            return FcmScheduleCancelResponse.from(canceled.get());
        }

        FcmScheduledNotification existing = repository.findById(scheduleId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FCM_SCHEDULE_NOT_FOUND));
        if (!existing.isCancelable()) {
            throw new RestApiException(ErrorCode.FCM_SCHEDULE_NOT_CANCELABLE);
        }

        throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_REQUEST);
    }

    public List<FcmScheduledNotification> findDueSchedules(Instant now) {
        return repository.findByStatusAndScheduledAtLessThanEqual(FcmScheduleStatus.SCHEDULED, now);
    }

    public Optional<FcmScheduledNotification> claimForSending(String scheduleId, Instant now) {
        return repository.claimForSending(scheduleId, now);
    }

    public void markSingleSent(String scheduleId, String messageId, Instant sentAt) {
        FcmScheduledNotification schedule = findSchedule(scheduleId);
        validateSending(schedule);
        schedule.markSingleSent(messageId, sentAt);
        repository.save(schedule);
    }

    public void markSingleFailed(String scheduleId, String failureReason) {
        FcmScheduledNotification schedule = findSchedule(scheduleId);
        validateSending(schedule);
        schedule.markSingleFailed(failureReason, Instant.now());
        repository.save(schedule);
    }

    public void markBatchSent(String scheduleId, int totalCount, MulticastPushResult result, Instant sentAt) {
        FcmScheduledNotification schedule = findSchedule(scheduleId);
        validateSending(schedule);
        schedule.markBatchSent(totalCount, result.successCount(), result.failureCount(), result.failedTokens(), sentAt);
        repository.save(schedule);
    }

    public void markNoTargetSent(String scheduleId, Instant sentAt) {
        FcmScheduledNotification schedule = findSchedule(scheduleId);
        validateSending(schedule);
        schedule.markBatchSent(0, 0, 0, List.of(), sentAt);
        repository.save(schedule);
    }

    public void markFailed(String scheduleId, String failureReason) {
        FcmScheduledNotification schedule = findSchedule(scheduleId);
        validateSending(schedule);
        schedule.markFailed(failureReason, Instant.now());
        repository.save(schedule);
    }

    private FcmScheduledNotification findSchedule(String scheduleId) {
        return repository.findById(scheduleId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FCM_SCHEDULE_NOT_FOUND));
    }

    private void validateSending(FcmScheduledNotification schedule) {
        if (schedule.getStatus() != FcmScheduleStatus.SENDING) {
            throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_REQUEST);
        }
    }

    private void validateCreateRequest(FcmScheduleCreateRequest request) {
        if (request == null || request.targetType() == null || request.scheduledAt() == null) {
            throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_REQUEST);
        }
        if (!StringUtils.hasText(request.title()) || !StringUtils.hasText(request.body())) {
            throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_REQUEST);
        }
        if (request.targetType() == FcmScheduleTargetType.SINGLE_TOKEN && !StringUtils.hasText(request.token())) {
            throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_REQUEST);
        }
        if (!request.scheduledAt().toInstant().isAfter(Instant.now())) {
            throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_TIME);
        }
        sanitizeData(request.data());
    }

    private Map<String, String> sanitizeData(Map<String, String> data) {
        if (data == null || data.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<String, String> sanitized = new LinkedHashMap<>();
        for (Map.Entry<String, String> entry : data.entrySet()) {
            if (!StringUtils.hasText(entry.getKey()) || entry.getValue() == null) {
                throw new RestApiException(ErrorCode.FCM_SCHEDULE_INVALID_REQUEST);
            }
            sanitized.put(entry.getKey(), entry.getValue());
        }
        return sanitized;
    }
}
