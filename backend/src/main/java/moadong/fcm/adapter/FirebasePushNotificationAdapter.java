package moadong.fcm.adapter;

import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.SendResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.fcm.model.MulticastPushPayload;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.model.PushPayload;
import moadong.fcm.model.TokenPushPayload;
import moadong.fcm.model.TokenPushResult;
import moadong.fcm.port.PushNotificationPort;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Component
@RequiredArgsConstructor
public class FirebasePushNotificationAdapter implements PushNotificationPort {

    private static final int MULTICAST_LIMIT = 500;

    private final FirebaseMessaging firebaseMessaging;

    @Override
    public TokenPushResult send(PushPayload payload) {
        log.info("PushPayload: {}", payload);
        Message.Builder builder = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(payload.title())
                        .setBody(payload.body())
                        .build())
                .setTopic(payload.topic());

        Map<String, String> data = sanitizeData(payload.data());
        if (!data.isEmpty()) {
            builder.putAllData(data);
        }

        try {
            String messageId = firebaseMessaging.send(builder.build());
            log.info("FCM send success - topic: {}, messageId: {}", payload.topic(), messageId);
            return new TokenPushResult(true, messageId);
        } catch (Exception e) {
            log.error("FCM send failed - topic: {}, error: {}", payload.topic(), e.getMessage());
            return new TokenPushResult(false, null);
        }
    }

    @Override
    public TokenPushResult sendToToken(TokenPushPayload payload) {
        if (!StringUtils.hasText(payload.token())) {
            log.warn("FCM send skipped - blank token");
            return new TokenPushResult(false, null);
        }

        Message.Builder builder = Message.builder()
                .setToken(payload.token())
                .setNotification(Notification.builder()
                        .setTitle(payload.title())
                        .setBody(payload.body())
                        .build());

        Map<String, String> data = sanitizeData(payload.data());
        if (!data.isEmpty()) {
            builder.putAllData(data);
        }

        try {
            String messageId = firebaseMessaging.send(builder.build());
            return new TokenPushResult(true, messageId);
        } catch (Exception e) {
            log.error("FCM send failed - token: {}, error: {}", mask(payload.token()), e.getMessage(), e);
            return new TokenPushResult(false, null);
        }
    }

    @Override
    public MulticastPushResult sendToTokens(MulticastPushPayload payload) {
        List<String> tokens = payload.tokens() == null ? List.of() : payload.tokens().stream()
                .filter(StringUtils::hasText)
                .collect(Collectors.collectingAndThen(
                        Collectors.toCollection(LinkedHashSet::new),
                        List::copyOf
                ));

        if (tokens.isEmpty()) {
            return new MulticastPushResult(0, 0, 0, List.of());
        }

        int batchCount = 0;
        int successCount = 0;
        int failureCount = 0;
        List<String> failedTokens = new ArrayList<>();
        Map<String, String> data = sanitizeData(payload.data());

        for (int start = 0; start < tokens.size(); start += MULTICAST_LIMIT) {
            int end = Math.min(start + MULTICAST_LIMIT, tokens.size());
            List<String> batchTokens = tokens.subList(start, end);
            batchCount++;

            MulticastMessage.Builder builder = MulticastMessage.builder()
                    .addAllTokens(batchTokens)
                    .setNotification(Notification.builder()
                            .setTitle(payload.title())
                            .setBody(payload.body())
                            .build());

            if (!data.isEmpty()) {
                builder.putAllData(data);
            }

            try {
                BatchResponse response = firebaseMessaging.sendEachForMulticast(builder.build());
                successCount += response.getSuccessCount();
                failureCount += response.getFailureCount();
                collectFailedTokens(batchTokens, response.getResponses(), failedTokens);
            } catch (Exception e) {
                log.error("FCM batch send failed - batch: {}, error: {}", batchCount, e.getMessage(), e);
                failureCount += batchTokens.size();
                failedTokens.addAll(batchTokens);
            }
        }

        return new MulticastPushResult(
                batchCount,
                successCount,
                failureCount,
                List.copyOf(failedTokens)
        );
    }

    private void collectFailedTokens(List<String> batchTokens, List<SendResponse> responses, List<String> failedTokens) {
        IntStream.range(0, responses.size())
                .filter(index -> !responses.get(index).isSuccessful())
                .mapToObj(batchTokens::get)
                .forEach(failedTokens::add);
    }

    public Map<String, String> sanitizeData(Map<String, String> data) {
        if (data == null || data.isEmpty()) {
            return Collections.emptyMap();
        }

        return data.entrySet().stream()
                .filter(entry -> StringUtils.hasText(entry.getKey()) && entry.getValue() != null)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
    }

    private String mask(String token) {
        if (!StringUtils.hasText(token) || token.length() < 10) {
            return "***";
        }
        return token.substring(0, 6) + "..." + token.substring(token.length() - 4);
    }
}
