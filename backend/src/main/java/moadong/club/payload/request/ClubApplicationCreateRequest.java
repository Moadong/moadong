package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClubApplicationCreateRequest(
        @NotBlank
        @Size(max = 20)
        String title,

        @NotNull
        @Valid
        List<ClubApplyQuestion> questions
) {
}
