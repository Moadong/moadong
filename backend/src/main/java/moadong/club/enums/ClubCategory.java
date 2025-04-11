package moadong.club.enums;

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

    public int getPriority() {
        return priority;
    }

    public static ClubCategory fromString(String category) {
        for (ClubCategory c : values()) {
            if (c.name().equals(category)) {
                return c;
            }
        }
        return null;
    }
    public static int getPriorityFromString(String category) {
        ClubCategory c = fromString(category);
        return (c != null) ? c.getPriority() : Integer.MAX_VALUE;
    }
}
