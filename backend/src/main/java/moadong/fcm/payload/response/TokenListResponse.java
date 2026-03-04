package moadong.fcm.payload.response;

import java.util.List;

public record TokenListResponse(
        List<String> tokens
) {
}
