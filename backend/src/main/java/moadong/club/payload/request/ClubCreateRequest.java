package moadong.club.payload.request;

public record ClubCreateRequest(
        String name,
        String category,
        String division
) {

}
