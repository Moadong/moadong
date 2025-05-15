package moadong.club.entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ClubApplicationQuestionType;
import moadong.club.payload.request.ClubApplicationRequest;

import java.util.List;

@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubApplicationQuestion {

    @NotNull
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ClubApplicationQuestionType type;

    @NotNull
    private ClubApplicationRequest.Options options;

    @NotNull
    private List<ClubApplicationRequest.QuestionItem> items;

}
