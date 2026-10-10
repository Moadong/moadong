package moadong.global.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.JwtProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.RefreshToken;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtProperties jwtProperties;

    private static final String TOKEN_TYPE_CLAIM = "type";
    public static final String ACCESS_TOKEN_TYPE = "access";
    public static final String REFRESH_TOKEN_TYPE = "refresh";

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (long) jwtProperties.accessToken().expiration().min() * 1000 * 60))
                .signWith(SignatureAlgorithm.HS256, jwtProperties.secretKey())
                .compact();
    }

    public String generateAccessTokenWithoutExpiration(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, jwtProperties.secretKey())
                .compact();
    }

    public RefreshToken generateRefreshToken(String username) {
        Date expiresAt = new Date(System.currentTimeMillis() + (long) jwtProperties.refreshToken().expiration().hour() * 1000 * 60 * 60);
        String refreshToken = Jwts.builder()
                .setSubject(username)
                .claim(TOKEN_TYPE_CLAIM, REFRESH_TOKEN_TYPE)
                .setIssuedAt(new Date())
                .setExpiration(expiresAt)
                .signWith(SignatureAlgorithm.HS256, jwtProperties.secretKey())
                .compact();
        return new RefreshToken(refreshToken,expiresAt);
    }

    // 토큰에서 사용자 이름 추출
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // 토큰 만료 확인
    public boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // 토큰 유효성 확인
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    // 만료 여부와 무관하게 서명이 유효하면 subject를 반환 (만료가 설정된 경우에만 만료 검사)
    public String extractSubjectIfValid(String token) {
        Claims claims = getClaims(token);
        Date expiration = claims.getExpiration();
        if (expiration != null && expiration.before(new Date())) {
            throw new RestApiException(ErrorCode.TOKEN_EXPIRED);
        }
        return claims.getSubject();
    }

    // access token 전용: type 클레임이 access인 경우에만 subject 반환
    public String extractAccessTokenSubject(String token) {
        Claims claims = getClaims(token);
        Date expiration = claims.getExpiration();
        if (expiration != null && expiration.before(new Date())) {
            throw new RestApiException(ErrorCode.TOKEN_EXPIRED);
        }
        if (!ACCESS_TOKEN_TYPE.equals(claims.get(TOKEN_TYPE_CLAIM, String.class))) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
        return claims.getSubject();
    }

    // Claims 추출
    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(jwtProperties.secretKey())
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e){
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtProperties.secretKey().getBytes());
    }
}
