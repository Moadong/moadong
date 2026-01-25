package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.payload.dto.ClubApplicationFormsResult;

import java.util.List;

@Builder
public record ClubApplicationFormsResponse(
        List<ClubApplicationFormsResult> forms
){
}
