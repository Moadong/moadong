package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.global.RegexConstants;
import org.checkerframework.common.aliasing.qual.Unique;

@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubRecruitmentInformation {

    @Id
    private String id;

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

    private List<String> feedImages;
    private List<String> tags;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ClubRecruitmentStatus clubRecruitmentStatus;

    private String recruitmentForm;

    public ClubRecruitmentInformation updateLogo(String logo) {
        this.logo = logo;
        return this;
    }

    public void updateRecruitmentStatus(ClubRecruitmentStatus status) {
        this.clubRecruitmentStatus = status;
    }

    public void updateDescription(ClubRecruitmentInfoUpdateRequest request) {
        this.description = request.description();
        this.recruitmentStart = request.recruitmentStart();
        this.recruitmentEnd = request.recruitmentEnd();
        this.recruitmentTarget = request.recruitmentTarget();
    }

    public boolean hasRecruitmentPeriod() {
        return recruitmentStart != null && recruitmentEnd != null;
    }

    public ZonedDateTime getRecruitmentStart() {
        ZoneId seoulZone = ZoneId.of("Asia/Seoul");
        return recruitmentStart.atZone(seoulZone);
    }

    public ZonedDateTime getRecruitmentEnd() {
        ZoneId seoulZone = ZoneId.of("Asia/Seoul");
        return recruitmentEnd.atZone(seoulZone);
    }

    public int getFeedAmounts(){
        return this.feedImages.size();
    }

    public void updateFeedImages(List<String> feedImages){
        this.feedImages = feedImages;
    }

    public void update(ClubInfoRequest request) {
        this.introduction = request.introduction();
        this.presidentName = request.presidentName();
        this.presidentTelephoneNumber = request.presidentPhoneNumber();
        this.tags = request.tags();
        this.recruitmentForm = request.recruitmentForm();
    }
}
