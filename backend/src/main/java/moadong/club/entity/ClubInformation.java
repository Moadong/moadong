package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.RecruitmentStatus;
import moadong.club.payload.request.ClubUpdateRequest;
import moadong.global.RegexConstants;
import org.checkerframework.common.aliasing.qual.Unique;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("club_informations")
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubInformation {

    @Id
    private String id;

    @NotNull
    @Column(unique = true, nullable = false)
    private String clubId;

    @Column(length = 1024)
    @Unique
    private String logo;

    @Column(length = 30)
    private String introduction;

    @Column(length = 20000)
    private String description;

    @Column(length = 5)
    private String presidentName;

    @Pattern(regexp = RegexConstants.PHONE_NUMBER, message = "전화번호 형식이 올바르지 않습니다.")
    @Column(length = 13)
    private String presidentTelephoneNumber;

    private LocalDateTime recruitmentStart;

    private LocalDateTime recruitmentEnd;

    private String recruitmentTarget;

    @Enumerated(EnumType.STRING)
    @NotNull
    private RecruitmentStatus recruitmentStatus;

    public void update(ClubUpdateRequest request) {
        this.introduction = request.introduction();
        this.description = request.description();
        this.presidentName = request.clubPresidentName();
        this.presidentTelephoneNumber = request.telephoneNumber();
        this.recruitmentStart = request.recruitmentStart();
        this.recruitmentEnd = request.recruitmentEnd();
        this.recruitmentTarget = request.recruitmentTarget();
        this.recruitmentStatus = RecruitmentStatus.UPCOMING;
    }

    public ClubInformation updateLogo(String logo) {
        this.logo = logo;
        return this;
    }

    public void updateRecruitmentStatus(RecruitmentStatus status) {
        this.recruitmentStatus = status;
    }

    public boolean hasRecruitmentPeriod() {
        return recruitmentStart != null && recruitmentEnd != null;
    }
}
