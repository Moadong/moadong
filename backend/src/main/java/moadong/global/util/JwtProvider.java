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

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
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
