package moadong.user.payload.response;

public record LoginResponse(
        String accessToken,
        String clubId
) {
}
