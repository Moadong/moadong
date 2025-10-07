package moadong.fcm.payload.response;

import java.util.ArrayList;

public record ClubSubscribeListResponse(
        ArrayList<String> clubIds
) {
}
