package moadong.club.util.search;

import lombok.Getter;

@Getter
public enum ClubSearchMatchType {
    EXACT(0),
    PREFIX(1),
    SUBSTRING(2),
    CHOSEONG(3),
    FUZZY(4),
    SEMANTIC(5);

    private final int priority;

    ClubSearchMatchType(int priority) {
        this.priority = priority;
    }
}
