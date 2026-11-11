package moadong.global;

public final class RegexConstants {
    public static final String PHONE_NUMBER = "\\d{2,3}-\\d{3,4}-\\d{4}";
    public static final String EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    public static final String UUID_V4 = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$";
    private RegexConstants() {
        throw new UnsupportedOperationException("이 클래스는 인스턴스로 만들면 안됩니다!");
    }
}
