package moadong.fcm.port;

import moadong.fcm.model.PushPayload;

public interface PushNotificationPort {
    boolean send(PushPayload payload);
}
