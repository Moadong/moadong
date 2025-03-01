package moadong.club.payload.request;

public record ClubCreateRequest(
        String name,
        String classification,
        String division
) {

}
