package moadong.club.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Arrays;
import lombok.Getter;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;

@Getter
@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum ClubCategory {
    //봉사,종교,취미교양,학술,운동,공연
    봉사(0),
    종교(1),
    취미교양(2),
    학술(3),
    운동(4),
    공연(5),

    기타(6);
    private final int priority;

    ClubCategory(int priority) {
        this.priority = priority;
    }

    public static ClubCategory fromString(String category) {
        return Arrays.stream(values())
            .filter(rs -> rs.name().equalsIgnoreCase(category))
            .findFirst()
            .orElse(null);
    }

    public static int getPriorityFromString(String category) {
        ClubCategory c = fromString(category);
        return (c != null) ? c.getPriority() : Integer.MAX_VALUE;
    }

    @JsonCreator
    public static ClubCategory from(String value) {
        try {
            return ClubCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RestApiException(ErrorCode.CLUB_CATEGORY_INVALID);
        }
    }
}
