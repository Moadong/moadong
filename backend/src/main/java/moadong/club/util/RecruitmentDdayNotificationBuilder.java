package moadong.club.util;

import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.fcm.enums.FcmAction;
import moadong.fcm.util.FcmTopicResolver;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class RecruitmentDdayNotificationBuilder {

    private final FcmTopicResolver fcmTopicResolver;

    public Message build(Club club, long daysLeft) {
        String body = resolveBody(daysLeft);

        return Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(club.getName())
                        .setBody(body)
                        .build())
                .putAllData(buildData(club))
                .setTopic(fcmTopicResolver.resolveTopic(club.getId()))
                .build();
    }

    private String resolveBody(long daysLeft) {
        return switch ((int) daysLeft) {
            case 7 -> "모집 마감까지 7일 남았어요! 관심 있다면 서둘러 지원하세요 🔥";
            case 3 -> "모집 마감 3일 전이에요! 놓치지 말고 지금 바로 지원하세요 ⏰";
            case 1 -> "내일 모집이 마감돼요! 마지막 기회를 놓치지 마세요 🚨";
            default -> throw new IllegalArgumentException("Unsupported daysLeft: " + daysLeft);
        };
    }

    private Map<String, String> buildData(Club club) {
        return Map.of(
                "path", "/webview/clubDetail/" + club.getId(),
                "action", FcmAction.NAVIGATE_WEBVIEW.name(),
                "clubId", club.getId()
        );
    }
}
