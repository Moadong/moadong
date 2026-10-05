package moadong.user.entity;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.user.entity.enums.SocialProvider;
import moadong.user.entity.enums.UserStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document("student_users")
@CompoundIndexes({
        @CompoundIndex(name = "uk_provider_social_id", def = "{'provider': 1, 'socialId': 1}", unique = true, sparse = true)
})
public class StudentUser {

    @Id
    private String id;

    @Indexed(unique = true, sparse = true)
    private String studentId;

    private SocialProvider provider;

    private String socialId;

    private String nickname;

    private String profileImageUrl;

    @Builder.Default
    @NotNull
    private UserStatus status = UserStatus.ACTIVE;

    @Builder.Default
    @NotNull
    private Boolean allowedPersonalInformation = false;

    @Builder.Default
    @Field("refreshTokens")
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    @Builder.Default
    @NotNull
    private Date createdAt = new Date();

    @Builder.Default
    @NotNull
    private Date lastSeenAt = new Date();

    private String currentFcmToken;

    public void updateLastSeen() {
        this.lastSeenAt = new Date();
    }

    public void updateCurrentFcmToken(String currentFcmToken) {
        this.currentFcmToken = currentFcmToken;
        this.lastSeenAt = new Date();
    }
}
