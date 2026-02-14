package moadong.club.util;

import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.fcm.enums.FcmAction;
import moadong.fcm.model.PushPayload;
import moadong.fcm.util.FcmTopicResolver;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ClubNotificationPayloadFactory {

    private final FcmTopicResolver fcmTopicResolver;

    public PushPayload create(Club club, String body) {
        return new PushPayload(
                club.getName(),
                body,
                fcmTopicResolver.resolveTopic(club.getId()),
                Map.of(
                        "path", "/webview/clubDetail/" + club.getId(),
                        "action", FcmAction.NAVIGATE_WEBVIEW.name(),
                        "clubId", club.getId()
                )
        );
    }
}
