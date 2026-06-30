package moadong.user.entity;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document("student_users")
public class StudentUser {

    @Id
    private String id;

    @Indexed(unique = true)
    @NotNull
    private String studentId;

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
