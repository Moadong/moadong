package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ClubApplicationCreateRequest(
        @NotBlank
        String form_title,

        @NotNull
        @Valid
        List<ClubApplyQuestion> questions
) {
}
