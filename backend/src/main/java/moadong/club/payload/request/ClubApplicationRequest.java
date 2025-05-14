package moadong.club.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import moadong.club.enums.ClubApplicationQuestionType;

import java.util.List;

public record ClubApplicationRequest(
        @NotBlank
        String title,

        @NotNull
        @Valid
        List<ClubApplyQuestion> questions
) {
    public record ClubApplyQuestion(
            @NotNull
            Long id,
            @NotBlank
            String title,
            @NotNull //빈칸 허용
            String description,
            @NotNull
            ClubApplicationQuestionType type,
            @NotNull
            Options options,
            @NotNull
            List<QuestionItem> items
    ) {}

    public record Options(
            @NotNull
            boolean required
    ) {}

    public record QuestionItem(
            String value
    ) {}
}
