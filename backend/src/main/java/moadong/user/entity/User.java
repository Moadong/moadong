package moadong.user.entity;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Collection;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.global.annotation.UserId;
import moadong.user.entity.enums.UserStatus;
import moadong.user.payload.request.UserUpdateRequest;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.core.GrantedAuthority;
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
    @Size(min = 8, max = 20)
    private String password;

    @Builder.Default
    @NotNull
    private Boolean emailVerified = false;

    @Builder.Default
    @NotNull
    private Date createdAt = new Date();

    private Date lastLoginAt;

    @Field("refreshToken")
    private RefreshToken refreshToken;

    @Field("userInformation")
    private UserInformation userInformation;

    @Builder.Default
    @NotNull
    private UserStatus status = UserStatus.ACTIVE;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userId;
    }

    public void updateUserProfile(UserUpdateRequest userUpdateRequest) {
        this.userId = userUpdateRequest.userId();
        this.password = userUpdateRequest.password();
    }
    public void updateRefreshToken(RefreshToken refreshToken) {
        this.refreshToken = refreshToken;
    }

}
