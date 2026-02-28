package moadong.user.entity;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.global.annotation.UserId;
import moadong.user.entity.enums.UserRole;
import moadong.user.entity.enums.UserStatus;
import moadong.user.payload.request.UserUpdateRequest;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document("users")
public class User implements UserDetails {

    @Id
    private String id;


    @Indexed(unique = true)
    @NotNull
    @UserId
    private String userId;

    @NotNull
    @Size(min = 8)
    private String password;

    @Builder.Default
    @NotNull
    private Boolean emailVerified = false;

    @NotNull
    private String clubId;

    @Builder.Default
    private UserRole role = UserRole.CLUB_ADMIN;

    @Builder.Default
    @NotNull
    private Date createdAt = new Date();

    private Date lastLoginAt;

    @Builder.Default
    @Field("refreshTokens")
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    @Field("userInformation")
    private UserInformation userInformation;

    @Builder.Default
    @NotNull
    private UserStatus status = UserStatus.ACTIVE;

    @Builder.Default
    @NotNull
    private Boolean allowedPersonalInformation = false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        UserRole effectiveRole = (role != null) ? role : UserRole.CLUB_ADMIN;
        return List.of(new SimpleGrantedAuthority("ROLE_" + effectiveRole.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userId;
    }

    public void updateId(String id) {
        this.id = id;
    }

    public void updateUserProfile(UserUpdateRequest userUpdateRequest) {
        this.password = userUpdateRequest.password();
    }

    public void resetPassword(String encodedPassword) { //초기화된 비밀번호 업데이트
        this.password = encodedPassword;
    }

    public void updateClubId(String clubId) {
        this.clubId = clubId;
    }

    public void addRefreshToken(RefreshToken refreshToken) {
        if (this.refreshTokens == null) {
            this.refreshTokens = new ArrayList<>();
        }
        this.refreshTokens.add(refreshToken);
    }

    public void replaceRefreshToken(String oldToken, RefreshToken newToken) {
        if (this.refreshTokens == null) {
            this.refreshTokens = new ArrayList<>();
            return;
        }
        for (int i = 0; i < this.refreshTokens.size(); i++) {
            if (this.refreshTokens.get(i).getToken().equals(oldToken)) {
                this.refreshTokens.set(i, newToken);
                return;
            }
        }
    }

    public void removeRefreshToken(String refreshToken) {
        if (this.refreshTokens == null) {
            return;
        }
        this.refreshTokens.removeIf(t -> t.getToken().equals(refreshToken));
    }

    public void removeAllRefreshTokens() {
        if (this.refreshTokens == null) {
            this.refreshTokens = new ArrayList<>();
            return;
        }
        this.refreshTokens.clear();
    }

    public void allowPersonalInformation() {
        this.allowedPersonalInformation = true;
    }
}
