package moadong.unit.user;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class DevPortalLogoutTest {

    @Test
    void 관리자_포털_로그아웃은_서버_로그아웃_API를_호출한다() throws IOException {
        // 로그아웃 로직은 index.html에서 분리된 셸 스크립트에 있다. 페이지가 그 스크립트를 실제로 불러오는지도 함께 본다.
        String indexHtml = new ClassPathResource("static/dev/index.html")
                .getContentAsString(StandardCharsets.UTF_8);
        String shellJs = new ClassPathResource("static/dev/js/shell.js")
                .getContentAsString(StandardCharsets.UTF_8);

        assertThat(indexHtml).contains("<script src=\"/dev/js/shell.js");
        assertThat(shellJs).contains("fetch(API_BASE + '/auth/user/logout'");
        assertThat(shellJs).contains("credentials: 'include'");
    }
}
