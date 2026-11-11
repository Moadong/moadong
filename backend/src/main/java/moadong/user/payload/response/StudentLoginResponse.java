package moadong.user.payload.response;

public record StudentLoginResponse(
        String accessToken,
        boolean isNewUser
) {
}
