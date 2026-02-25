package moadong.user.view;

public class UserSwaggerView {
    public static final String ADMIN_REGISTER_SUMMARY = "관리자 회원가입";
    public static final String ADMIN_PWD_ROLE_DESCRIPTION = "**비밀번호 조건**<br>" +
            "<br>" +
            "1. 최소 8자 이상 (상한 없음)<br>" +
            "2. 알파벳 대소문자(a~z, A~Z)와 숫자(0~9)를 각각 하나 이상 포함<br>" +
            "3. 특수문자는 허용되지만 필수는 아니며 공백은 허용하지 않음";

    public static final String ADMIN_LOGIN_SUMMARY = "관리자 로그인";
    public static final String ADMIN_LOGIN_DESCRIPTION = "**아이디**<br>"
        + "<br>"
        + "- 5자 ~ 20자<br>"
        + "- 적어도 하나의 소문자, 하나의 숫자가 포함<br>"
        + "- 소문자, 대문자, 숫자, 특수문자(!@#$~) 만 사용.<br>"
        + "<br>"
        + "**비밀번호**<br>"
        + "<br>"
        + "- 8자 이상 (상한 없음)<br>"
        + "- 숫자랑 영어 대소문자 반드시 하나이상 포함<br>"
        + "- 특수문자는 허용되지만 필수는 아님<br>"
        + "- 공백 포함 불가<br>"
        + "- 이메일과 동일한 비밀번호 불가<br>"
        + "- 비밀번호 유효 기간 6개월- 이후 비밀번호 변경 권장하는 창 표시를 위함";
}
