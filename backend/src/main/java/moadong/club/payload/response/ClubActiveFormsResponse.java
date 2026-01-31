package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.payload.dto.ClubActiveFormResult;

import java.util.List;

@Builder
public record ClubActiveFormsResponse (
        List<ClubActiveFormResult> forms
){
}
