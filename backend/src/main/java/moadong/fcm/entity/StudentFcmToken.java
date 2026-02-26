package moadong.fcm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("student_fcm_token")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class StudentFcmToken {

    @Id
    private String id;

    @Indexed(unique = true, sparse = true)
    private String studentId;

    @Indexed(unique = true)
    private String token;

    @Builder.Default
    private List<String> clubIds = new ArrayList<>();

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public void updateStudentId(String studentId) {
        this.studentId = studentId;
    }

    public void replaceToken(String token) {
        this.token = token;
        this.timestamp = LocalDateTime.now();
    }

    public void updateClubIds(List<String> clubIds) {
        this.clubIds.clear();
        this.clubIds.addAll(clubIds);
    }

    public void updateTimestamp() {
        this.timestamp = LocalDateTime.now();
    }
}
