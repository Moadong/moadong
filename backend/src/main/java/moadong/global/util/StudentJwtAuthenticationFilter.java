package moadong.global.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.payload.Response;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class StudentJwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StudentJwtAuthenticationFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/student");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            sendError(response, ErrorCode.TOKEN_INVALID);
            return;
        }

        String token = header.substring(7);
        if (token.isBlank()) {
            sendError(response, ErrorCode.TOKEN_INVALID);
            return;
        }
        try {
            String studentId = jwtProvider.extractSubjectIfValid(token);
            var auth = new UsernamePasswordAuthenticationToken(studentId, null, List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (RestApiException e) {
            sendError(response, e.getErrorCode());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType("application/json;charset=UTF-8");
        Response<?> body = new Response<>(errorCode.getCode(), errorCode.getMessage(), null);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
