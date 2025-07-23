package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubQuestionOption {

    private Boolean required;

}
