package moadong.fcm.payload.response;

import java.util.List;

public record ClubSubscribeListResponse(
        List<String> clubIds
) {
}
