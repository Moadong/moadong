package moadong.sse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.payload.dto.ApplicantStatusEvent;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.payload.CustomUserDetails;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApplicantsStatusShareSse implements MessageListener {

    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisMessageListenerContainer redisMessageListenerContainer;
    private final ObjectMapper objectMapper;

    private final Map<String, Map<String, SseEmitter>> sseConnections = new ConcurrentHashMap<>();

    private static final long SSE_EMITTER_TIME_OUT = 60 * 60 * 1000L;
    private static final int MAX_SESSIONS_PER_CLUB = 20;
    private static final String CHANNEL_PREFIX = "sse:applicant-status:";

    @PostConstruct
    public void init() {
        redisMessageListenerContainer.addMessageListener(this, new PatternTopic(CHANNEL_PREFIX + "*"));
    }

    public SseEmitter createSseSession(String applicationFormId, CustomUserDetails user) {
        String clubId = user.getClubId();

        clubApplicationFormsRepository.findByClubIdAndId(clubId, applicationFormId)
                .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));

        String connectionKey = applicationFormId + "_" + UUID.randomUUID();

        Map<String, SseEmitter> clubEmitters = sseConnections.computeIfAbsent(clubId, k -> new ConcurrentHashMap<>());

        if (clubEmitters.size() >= MAX_SESSIONS_PER_CLUB) {
            String keyToRemove = clubEmitters.keySet().iterator().next();
            SseEmitter oldEmitter = clubEmitters.get(keyToRemove);

            if (oldEmitter != null) {
                oldEmitter.complete();
                clubEmitters.remove(keyToRemove);
            }
        }

        SseEmitter emitter = new SseEmitter(SSE_EMITTER_TIME_OUT);
        clubEmitters.put(connectionKey, emitter);

        Runnable removeCallback = () -> {
            sseConnections.computeIfPresent(clubId, (key, innerMap) -> {
               innerMap.remove(connectionKey);
               return innerMap.isEmpty() ? null : innerMap;
            });
        };

        emitter.onCompletion(removeCallback);
        emitter.onTimeout(removeCallback);
        emitter.onError((ex) -> {
            if (ex.getMessage() != null && ex.getMessage().contains("Broken pipe")) {
                log.info("SSE Client Disconnected [Club: {}, Key: {}]", clubId, connectionKey);
            } else {
                log.error("SSE Error [Club: {}, Key: {}]", clubId, connectionKey, ex);
            }
            removeCallback.run();
        });

        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (Exception e) {
            removeCallback.run();
            emitter.completeWithError(e);
        }

        return emitter;
    }

    public void publishStatusChangeEvent(String clubId, String applicationFormId, ApplicantStatusEvent event) {
        String channel = CHANNEL_PREFIX + clubId + ":" + applicationFormId;
        redisTemplate.convertAndSend(channel, event);
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String channel = new String(message.getChannel(), StandardCharsets.UTF_8);

            String channelSuffix = channel.substring(CHANNEL_PREFIX.length());
            String[] parts = channelSuffix.split(":", 2);
            if (parts.length < 2) {
                log.warn("Invalid channel format: {}", channel);
                return;
            }

            String clubId = parts[0];
            String applicationFormId = parts[1];

            ApplicantStatusEvent event = objectMapper.readValue(message.getBody(), ApplicantStatusEvent.class);
            broadcastToLocalConnections(clubId, applicationFormId, event);

        } catch (Exception e) {
            log.error("Failed to process Redis message: {}", e.getMessage(), e);
        }
    }

    private void broadcastToLocalConnections(String clubId, String applicationFormId, ApplicantStatusEvent event) {
        Map<String, SseEmitter> clubEmitters = sseConnections.get(clubId);
        if (clubEmitters == null || clubEmitters.isEmpty()) {
            return;
        }

        String connectionKeyPrefix = applicationFormId + "_";

        clubEmitters.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(connectionKeyPrefix))
                .forEach(entry -> {
                    String key = entry.getKey();
                    SseEmitter emitter = entry.getValue();

                    try {
                        emitter.send(SseEmitter.event()
                                .name("applicant-status-changed")
                                .data(event));
                    } catch (Exception e) {
                        log.warn("SSE 이벤트 발송 실패: {}", e.getMessage());
                        clubEmitters.remove(key);
                        try {
                            emitter.completeWithError(e);
                        } catch (Exception ignore) {
                        }
                    }
                });
    }

    @Scheduled(fixedRate = 45000L)
    public void sendHeartBeat() {
        sseConnections.values()
                .stream().flatMap(innerMap -> innerMap.values().stream())
                .forEach(emitter -> {
                    try {
                        emitter.send(SseEmitter.event().name("ping").data(""));
                    } catch (Exception e) {
                        emitter.completeWithError(e);
                    }
                });
    }
}
