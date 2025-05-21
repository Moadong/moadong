package moadong.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class RefreshToken {
    private String token;
    private Date expiresAt;
}
