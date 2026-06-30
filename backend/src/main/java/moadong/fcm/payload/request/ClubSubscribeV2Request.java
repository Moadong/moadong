package moadong.fcm.payload.request;

import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;

public record ClubSubscribeV2Request(
        @NotNull
        ArrayList<String> clubIds
) {
}
