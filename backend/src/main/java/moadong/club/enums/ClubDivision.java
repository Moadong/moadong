package moadong.club.enums;

import java.util.Arrays;
import lombok.Getter;

@Getter
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

    public static int getPriorityFromString(String division) {
        ClubDivision c = fromString(division);
        return (c != null) ? c.getPriority() : Integer.MAX_VALUE;
    }
}
