package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.enums.ClubState;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

@Document("clubs")
@AllArgsConstructor
@Getter
public class Club {

    @Id
    private String id;

    @NotNull
    @Column(length = 20)
    private String name;

    @NotNull
    @Column(length = 20)
    private String category;

    @NotNull
    @Column(length = 20)
    private String division;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ClubState state;

    private String userId;

    private Map<String, String> socialLinks;

    @Field("recruitmentInformation")
    private ClubRecruitmentInformation clubRecruitmentInformation;

    public Club() {
        this.name = "";
        this.category = "";
        this.division = "";
        this.state = ClubState.UNAVAILABLE;
        this.clubRecruitmentInformation = ClubRecruitmentInformation.builder().build();
    }

    public Club(String userId) {
        this.name = "";
        this.category = "";
        this.division = "";
        this.state = ClubState.UNAVAILABLE;
        this.clubRecruitmentInformation = ClubRecruitmentInformation.builder().build();
        this.userId = userId;
    }

    @Builder
    public Club(String name, String category, String division,
                ClubRecruitmentInformation clubRecruitmentInformation) {
        this.name = name;
        this.category = category;
        this.division = division;
        this.clubRecruitmentInformation = clubRecruitmentInformation;
    }

    public void update(ClubInfoRequest request) {
        validateTags(request.tags());
        validateIntroduction(request.introduction());

        this.name = request.name();
        this.category = request.category().name();
        this.division = request.division().name();
        this.state = ClubState.AVAILABLE;
        this.socialLinks = request.socialLinks();
        this.clubRecruitmentInformation.update(request);
    }

    private void validateTags(List<String> tags) {
        if (tags.size() > 3) {
            throw new RestApiException(ErrorCode.TOO_MANY_TAGS);
        }

        for (String tag : tags) {
            if (tag.length() > 5) {
                throw new RestApiException(ErrorCode.TOO_LONG_TAG);
            }
        }
    }

    private void validateIntroduction(String introduction) {
        if (introduction.length() > 24) {
            throw new RestApiException(ErrorCode.TOO_LONG_INTRODUCTION);
        }
    }

    public void update(ClubRecruitmentInfoUpdateRequest request) {
        clubRecruitmentInformation.updateDescription(request);
    }

    public void updateLogo(String logo) {
        this.clubRecruitmentInformation.updateLogo(logo);
    }

    public void updateCover(String cover) {
        this.clubRecruitmentInformation.updateCover(cover);
    }

    public void updateFeedImages(List<String> feedImages) {
        this.clubRecruitmentInformation.updateFeedImages(feedImages);
    }

    public void updateRecruitmentStatus(ClubRecruitmentStatus clubRecruitmentStatus) {
        this.clubRecruitmentInformation.updateRecruitmentStatus(clubRecruitmentStatus);
    }
}
