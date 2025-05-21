package moadong.global;

public final class RegexConstants {
    public static final String PHONE_NUMBER = "\\d{2,3}-\\d{3,4}-\\d{4}";
    public static final String EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private RegexConstants() {
        throw new UnsupportedOperationException("이 클래스는 인스턴스로 만들면 안됩니다!");
    }
}
