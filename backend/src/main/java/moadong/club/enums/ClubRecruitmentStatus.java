package moadong.club.enums;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum ClubRecruitmentStatus {
    ALWAYS("상시모집", 2),
    OPEN("모집중", 1),
    CLOSED("모집마감", 4),
    UPCOMING("모집예정", 3),
;

    private final String description;
    private final int priority;

    ClubRecruitmentStatus(String description, int priority) {
        this.description = description;
        this.priority = priority;
    }

    public static ClubRecruitmentStatus fromString(String status) {
        return Arrays.stream(values())
                .filter(rs -> rs.name().equalsIgnoreCase(status))
                .findFirst()
                .orElse(null);
    }
    public static int getPriorityFromString(String status) {
        ClubRecruitmentStatus rs = fromString(status);
        return (rs != null) ? rs.getPriority() : Integer.MAX_VALUE;
    }
}
