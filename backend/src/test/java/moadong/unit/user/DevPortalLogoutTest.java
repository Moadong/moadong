package moadong.unit.user;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class DevPortalLogoutTest {

    @Test
    void 관리자_포털_로그아웃은_서버_로그아웃_API를_호출한다() throws IOException {
        String indexHtml = new ClassPathResource("static/dev/index.html")
                .getContentAsString(StandardCharsets.UTF_8);

        assertThat(indexHtml).contains("fetch(API_BASE + '/auth/user/logout'");
        assertThat(indexHtml).contains("credentials: 'include'");
    }
}
