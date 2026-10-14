package moadong.club.payload.request;

import jakarta.validation.constraints.NotNull;
import moadong.club.enums.ClubState;

public record ClubStateUpdateRequest(
    @NotNull
    ClubState state
) {

}
