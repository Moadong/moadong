package moadong.club.controller;

import moadong.club.enums.ClubState;
import moadong.club.payload.request.ClubStateUpdateRequest;
import moadong.club.service.ClubProfileService;
import moadong.global.config.SecurityConfig;
import moadong.global.util.JwtProvider;
import moadong.user.entity.User;
import moadong.user.entity.enums.UserRole;
import moadong.user.payload.CustomUserDetails;
import moadong.user.service.CustomUserDetailService;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit.jupiter.web.SpringJUnitWebConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * ClubAdminController는 @PreAuthorize 없이 SecurityConfig의 /api/admin/** 규칙으로만 막는다.
 * 그래서 실제 SecurityConfig를 띄워 그 규칙이 상태 변경 요청을 403으로 돌려보내는지 본다.
 */
@UnitTest
@SpringJUnitWebConfig(ClubAdminControllerTest.TestConfig.class)
class ClubAdminControllerTest {

    private static final String CLUB_ID = "507f1f77bcf86cd799439011";

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private ClubProfileService clubProfileService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        clearInvocations(clubProfileService);
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @WithMockUser(roles = "CLUB_ADMIN")
    void DEVELOPER가_아니면_403이고_상태를_바꾸지_않는다() throws Exception {
        mockMvc.perform(put("/api/admin/club/{clubId}/state", CLUB_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"state\":\"UNAVAILABLE\"}"))
                .andExpect(status().isForbidden());

        verify(clubProfileService, never()).updateClubStateByClubId(any(), any(), any());
    }

    @Test
    void DEVELOPER는_동아리_상태를_바꾼다() throws Exception {
        CustomUserDetails developer = new CustomUserDetails(User.builder()
                .id("developer-doc-id").userId("developer").password("password").role(UserRole.DEVELOPER).build());

        mockMvc.perform(put("/api/admin/club/{clubId}/state", CLUB_ID)
                        .with(user(developer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"state\":\"UNAVAILABLE\"}"))
                .andExpect(status().isOk());

        verify(clubProfileService).updateClubStateByClubId(
                CLUB_ID, new ClubStateUpdateRequest(ClubState.UNAVAILABLE), developer);
    }

    @Test
    @WithMockUser(roles = "DEVELOPER")
    void 알_수_없는_상태값이면_400이고_상태를_바꾸지_않는다() throws Exception {
        mockMvc.perform(put("/api/admin/club/{clubId}/state", CLUB_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"state\":\"UNAVAILBLE\"}"))
                .andExpect(status().isBadRequest());

        verify(clubProfileService, never()).updateClubStateByClubId(any(), any(), any());
    }

    @Test
    @WithMockUser(roles = "DEVELOPER")
    void 상태값이_없으면_400이고_상태를_바꾸지_않는다() throws Exception {
        mockMvc.perform(put("/api/admin/club/{clubId}/state", CLUB_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());

        verify(clubProfileService, never()).updateClubStateByClubId(any(), any(), any());
    }

    @Configuration
    @EnableWebMvc
    @Import(SecurityConfig.class)
    static class TestConfig {

        @Bean
        JwtProvider jwtProvider() {
            return mock(JwtProvider.class);
        }

        @Bean
        CustomUserDetailService customUserDetailService() {
            return mock(CustomUserDetailService.class);
        }

        @Bean
        ClubProfileService clubProfileService() {
            return mock(ClubProfileService.class);
        }

        @Bean
        ClubAdminController clubAdminController(ClubProfileService service) {
            return new ClubAdminController(service);
        }
    }
}
