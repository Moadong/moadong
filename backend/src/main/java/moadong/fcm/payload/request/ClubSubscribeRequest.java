package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;

public record ClubSubscribeRequest(
        @NotNull
        String fcmToken,
        @NotNull
        ArrayList<String> clubIds
) {
}
