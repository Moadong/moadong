package moadong.user.service;

import lombok.RequiredArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.JwtProvider;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentJwtService {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtProvider jwtProvider;

    public String extractStudentId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        String studentId = jwtProvider.extractUsername(token);
        if (studentId == null || studentId.isBlank()) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        try {
            UUID.fromString(studentId);
        } catch (RuntimeException e) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        return studentId;
    }
}
