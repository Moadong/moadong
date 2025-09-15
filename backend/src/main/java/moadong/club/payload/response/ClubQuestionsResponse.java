package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.payload.dto.ClubQuestionsResult;

import java.util.List;

@Builder
public record ClubQuestionsResponse (
        List<ClubQuestionsResult> clubQuestions
){
}
