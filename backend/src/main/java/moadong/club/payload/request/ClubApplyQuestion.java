package moadong.club.payload.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moadong.club.enums.ClubApplicationQuestionType;

import java.util.List;

public record ClubApplyQuestion(
        @NotNull
        Long id,
        @NotBlank
        @Size(max = 10)
        String title,
        @NotNull //빈칸 허용
        String description,
        @NotNull
        ClubApplicationQuestionType type,
        @NotNull
        Options options,
        @NotNull
        List<QuestionItem> items
) {
    public record Options(
            @NotNull
            boolean required
    ) {}

    public record QuestionItem(
            @Size(max = 20)
            String value
    ) {}
}