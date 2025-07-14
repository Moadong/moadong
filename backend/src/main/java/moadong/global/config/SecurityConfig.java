package moadong.global.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import moadong.global.util.JwtAuthenticationFilter;
import moadong.global.util.JwtProvider;
import moadong.user.service.CustomUserDetailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.ResourceUtils;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
@SecurityScheme(
        name = "BearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailService userDetailsService;
//    @Value("${spring.cloud.gcp.credentials.location}")
//    private String credentialsLocation;

    public SecurityConfig(JwtProvider jwtProvider, CustomUserDetailService userDetailsService) {
        this.jwtProvider = jwtProvider;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화
            .authorizeHttpRequests(authorize -> authorize
                .anyRequest().permitAll() // 모든 요청에 대해 인증 해제
            );

        http.addFilterBefore(new JwtAuthenticationFilter(jwtProvider, userDetailsService), UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

//    @Bean
//    public Storage storage() throws IOException {
//        InputStream keyFile = ResourceUtils.getURL(credentialsLocation).openStream();
//        return StorageOptions.newBuilder()
//                .setCredentials(GoogleCredentials.fromStream(keyFile))
//                .build()
//                .getService();
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
