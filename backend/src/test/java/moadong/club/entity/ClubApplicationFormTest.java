package moadong.club.entity;

import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@UnitTest
class ClubApplicationFormTest {

    @ParameterizedTest
    @ValueSource(strings = {
            "https://forms.gle/abcd",
            "https://docs.google.com/forms/d/e/1FAIpQL/viewform",
            "https://form.naver.com/response/abcd",
            "https://naver.me/xyz",
            "https://everytime.kr/board/1",
            "https://cafe.daum.net/pknusic/OMPr/43"
    })
    void 허용된_외부폼_호스트는_저장된다(String url) {
        ClubApplicationForm form = ClubApplicationForm.builder().build();

        form.updateExternalApplicationUrl(url);

        assertThat(form.getExternalApplicationUrl()).isEqualTo(url);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "https://forms.gle@evil.example/abcd",           // userinfo로 host 위장
            "https://forms.gle.evil.example/abcd",           // suffix 로 host 위장
            "https://everytime.kr.evil.example/board/1",
            "https://cafe.daum.net.evil.example/pknusic/OMPr/43",
            "https://evil.example/abcd",
            "http://forms.gle/abcd",                         // https 아님
            "https://docs.google.com/document/d/1/edit",     // 구글 문서(폼 아님)
            "javascript:alert(1)"
    })
    void 허용되지_않은_외부폼_URL은_예외가_발생한다(String url) {
        ClubApplicationForm form = ClubApplicationForm.builder().build();

        assertThatThrownBy(() -> form.updateExternalApplicationUrl(url))
                .isInstanceOf(RestApiException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.NOT_ALLOWED_EXTERNAL_URL);
    }

    @ParameterizedTest
    @ValueSource(strings = {"  https://forms.gle/abcd  ", "https://forms.gle/abcd\n"})
    void 외부폼_URL의_앞뒤_공백은_제거하고_저장한다(String url) {
        ClubApplicationForm form = ClubApplicationForm.builder().build();

        form.updateExternalApplicationUrl(url);

        assertThat(form.getExternalApplicationUrl()).isEqualTo("https://forms.gle/abcd");
    }
}
