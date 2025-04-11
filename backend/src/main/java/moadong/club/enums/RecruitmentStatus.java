package moadong.club.enums;

import java.util.Arrays;

public enum RecruitmentStatus {
    ALWAYS("상시모집", 1),
    OPEN("모집중", 2),
    CLOSED("모집마감", 3),
    UPCOMING("모집예정", 4),
;

    private final String description;
    private final int priority;

    RecruitmentStatus(String description, int priority) {
        this.description = description;
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public int getPriority() {
        return priority;
    }

    public static RecruitmentStatus fromString(String status) {
        return Arrays.stream(values())
                .filter(rs -> rs.name().equalsIgnoreCase(status))
                .findFirst()
                .orElse(null);
    }
    public static int getPriorityFromString(String status) {
        RecruitmentStatus rs = fromString(status);
        return (rs != null) ? rs.getPriority() : Integer.MAX_VALUE;
    }
}
