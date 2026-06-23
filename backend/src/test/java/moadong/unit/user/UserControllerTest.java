package moadong.unit.user;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import moadong.user.controller.UserController;
import moadong.user.service.UserCommandService;
import moadong.user.util.CookieMaker;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@UnitTest
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserCommandService userCommandService;

    @Mock
    private CookieMaker cookieMaker;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new UserController(userCommandService, cookieMaker))
                .build();
    }

    @Test
    void 로그아웃은_refreshToken_쿠키를_읽고_만료시킨다() throws Exception {
        String refreshToken = "refreshToken123";
        ResponseCookie expiredCookie = ResponseCookie.from("refreshToken", "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .domain(".moadong.com")
                .sameSite("None")
                .build();
        when(cookieMaker.makeExpiredRefreshTokenCookie()).thenReturn(expiredCookie);

        mockMvc.perform(get("/auth/user/logout")
                        .cookie(new Cookie("refreshToken", refreshToken)))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("refreshToken", 0))
                .andExpect(header().string(HttpHeaders.SET_COOKIE,
                        "refreshToken=; Path=/; Domain=.moadong.com; Max-Age=0; Expires=Thu, 1 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=None"));

        verify(userCommandService).logoutUser(refreshToken);
        verify(cookieMaker).makeExpiredRefreshTokenCookie();
    }
}
