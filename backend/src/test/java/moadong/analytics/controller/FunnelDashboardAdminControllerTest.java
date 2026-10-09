package moadong.analytics.controller;

import moadong.analytics.payload.response.FunnelDashboardResponse;
import moadong.analytics.service.FunnelDashboardService;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.junit.jupiter.web.SpringJUnitWebConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * 실제 SecurityConfig 대신 최소 보안 컨텍스트만 띄워 @PreAuthorize("hasRole('DEVELOPER')")가 403으로 이어지는지 본다.
 */
@UnitTest
@SpringJUnitWebConfig(FunnelDashboardAdminControllerTest.TestConfig.class)
class FunnelDashboardAdminControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private FunnelDashboardService funnelDashboardService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @WithMockUser(roles = "USER")
    void DEVELOPER가_아니면_403이다() throws Exception {
        mockMvc.perform(get("/api/admin/statistics/funnels")
                        .param("from", "2026-09-01")
                        .param("to", "2026-09-07"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "DEVELOPER")
    void DEVELOPER는_퍼널_대시보드를_조회한다() throws Exception {
        LocalDate from = LocalDate.of(2026, 9, 1);
        LocalDate to = LocalDate.of(2026, 9, 7);
        when(funnelDashboardService.getDashboard(from, to))
                .thenReturn(new FunnelDashboardResponse(from, to, 7, 7, List.of(), List.of(), List.of()));

        mockMvc.perform(get("/api/admin/statistics/funnels")
                        .param("from", "2026-09-01")
                        .param("to", "2026-09-07")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.requestedDays").value(7))
                .andExpect(jsonPath("$.data.collectedDays").value(7));
    }

    @Configuration
    @EnableWebMvc
    @EnableWebSecurity
    @EnableMethodSecurity
    static class TestConfig {

        @Bean
        FunnelDashboardService funnelDashboardService() {
            return mock(FunnelDashboardService.class);
        }

        @Bean
        FunnelDashboardAdminController funnelDashboardAdminController(FunnelDashboardService service) {
            return new FunnelDashboardAdminController(service);
        }

        @Bean
        SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http.csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}
