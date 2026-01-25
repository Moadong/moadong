package moadong.club.payload.request;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import moadong.club.enums.ClubApplicationQuestionType;

public record ClubApplyQuestion(
        @NotNull
        Long id,
        @NotBlank
        @Size(max = 200)
        String title,
        @NotNull //빈칸 허용
        String description,
        @NotNull
        ClubApplicationQuestionType type,
        @NotNull
        Options options,
        @NotNull
        @Valid
        List<QuestionItem> items
) {
    public record Options(
            @NotNull
            boolean required
    ) {}

    public record QuestionItem(
            @NotNull
            @Size(max = 200)
            String value
    ) {}
}