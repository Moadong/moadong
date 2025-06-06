package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ClubApplyRequest(
        @NotNull
        @Valid
        List<Answer> questions
) {
    public record Answer(
            @NotNull
            Long id,
            @NotNull //빈칸 상관없음
            String value
    ) {
    }
}
