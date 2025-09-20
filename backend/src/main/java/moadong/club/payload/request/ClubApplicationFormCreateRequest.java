package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import moadong.club.enums.SemesterTerm;

import java.util.List;

public record ClubApplicationFormCreateRequest(
        @NotBlank
        @Size(max = 50)
        String title,

        @NotBlank
        @Size(max = 3000)
        String description,

        @NotNull
        @Valid
        List<ClubApplyQuestion> questions,

        @NotNull
        @Min(2000)
        @Max(2999)
        Integer semesterYear,

        @NotNull
        SemesterTerm semesterTerm
) {
}
