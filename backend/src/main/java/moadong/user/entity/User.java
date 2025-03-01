package moadong.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.global.annotation.UserId;
import moadong.user.entity.enums.UserStatus;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;

@Entity
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
}
