package moadong.fcm.port;

import moadong.fcm.model.MulticastPushPayload;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.model.PushPayload;
import moadong.fcm.model.TokenPushPayload;
import moadong.fcm.model.TokenPushResult;

public interface PushNotificationPort {
    TokenPushResult send(PushPayload payload);

    TokenPushResult sendToToken(TokenPushPayload payload);

    MulticastPushResult sendToTokens(MulticastPushPayload payload);
}
