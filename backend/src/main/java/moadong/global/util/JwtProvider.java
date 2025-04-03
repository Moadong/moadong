package moadong.global.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.RefreshToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {
    @Value("${jwt.access.token.expiration.min}")
    private int ACCESS_EXPIRATION_MIN;
    @Value("${jwt.refresh.token.expiration.hour}")
    private int REFRESH_EXPIRATION_HOUR;
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (long) ACCESS_EXPIRATION_MIN * 1000 * 60))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public RefreshToken generateRefreshToken(String username) {
        Date expiresAt = new Date(System.currentTimeMillis() + (long) REFRESH_EXPIRATION_HOUR * 1000 * 60 * 60);
        String refreshToken = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiresAt)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
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
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e){
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
}
