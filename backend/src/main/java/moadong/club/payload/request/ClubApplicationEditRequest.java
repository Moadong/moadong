package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClubApplicationEditRequest(
        @NotBlank
        String form_title,

        @NotNull
        @Valid
        List<ClubApplyQuestion> questions
) {
}
