package moadong.club.enums;

import lombok.Getter;

@Getter
public enum ClubApplicationQuestionType {
    CHOICE,
    MULTI_CHOICE,
    SHORT_TEXT,
    LONG_TEXT,
    PHONE_NUMBER,
    EMAIL,
    NAME;
}
