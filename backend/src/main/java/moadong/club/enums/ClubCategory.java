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
    private final int order;

    ClubCategory(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }

    public static ClubCategory fromString(String category) {
        for (ClubCategory c : values()) {
            if (c.name().equals(category)) {
                return c;
            }
        }
        return null;
    }
}
