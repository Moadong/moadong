package moadong.club.payload.response;

import java.util.List;
import moadong.club.enums.ClubState;

public record ClubListResponse(List<ClubListResponseItem> clubs) {

    public record ClubListResponseItem(String id, String name, String userId, ClubState state) {
    }
}
