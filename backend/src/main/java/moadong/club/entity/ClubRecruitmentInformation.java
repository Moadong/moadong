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
import moadong.club.enums.RecruitmentStatus;
import moadong.club.payload.request.ClubDescriptionUpdateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.global.RegexConstants;
import org.checkerframework.common.aliasing.qual.Unique;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private RecruitmentStatus recruitmentStatus;

    private String recruitmentForm;

    public ClubRecruitmentInformation updateLogo(String logo) {
        this.logo = logo;
        return this;
    }

    public void update(ClubInfoRequest clubInfoRequest){
        this.recruitmentEnd = clubInfoRequest.recruitmentEnd();
        this.recruitmentStart = clubInfoRequest.recruitmentStart();
        this.presidentName = clubInfoRequest.clubPresidentName();
        this.presidentTelephoneNumber = clubInfoRequest.telephoneNumber();
        this.recruitmentTarget = clubInfoRequest.recruitmentTarget();
        this.introduction = clubInfoRequest.introduction();
        this.tags = clubInfoRequest.tags();
    }

    public void updateRecruitmentStatus(RecruitmentStatus status) {
        this.recruitmentStatus = status;
    }

    public void updateDescription(ClubDescriptionUpdateRequest request) {
        this.description = request.description();
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
}
