package moadong.club.payload.response;

import java.util.List;

public record ClubListResponse(List<ClubListResponseItem> clubs) {

    public record ClubListResponseItem(String id, String name, String userId) {
    }
}
