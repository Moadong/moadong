package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ClubApplicationFormEditRequest(
        @NotBlank
        @Size(max = 50)
        String title,

        @NotBlank
        @Size(max = 3000)
        String description,

        @NotNull
        Boolean active,

        @NotNull
        @Valid
        List<ClubApplyQuestion> questions
) {
}
