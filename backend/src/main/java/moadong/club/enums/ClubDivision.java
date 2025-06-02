package moadong.club.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Arrays;
import lombok.Getter;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;

@Getter
@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum ClubDivision {
    중동(1);

    private final int priority;

    ClubDivision(int priority) {
        this.priority = priority;
    }

    public static ClubDivision fromString(String division) {
        return Arrays.stream(values())
            .filter(rs -> rs.name().equalsIgnoreCase(division))
            .findFirst()
            .orElse(null);
    }

    @JsonCreator
    public static ClubDivision from(String value) {
        try {
            return ClubDivision.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RestApiException(ErrorCode.CLUB_DIVISION_INVALID);
        }
    }
}
