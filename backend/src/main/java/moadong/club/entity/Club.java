package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ClubState;
import moadong.club.payload.request.ClubDescriptionUpdateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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


    @Field("recruitmentInformation")
    private ClubRecruitmentInformation clubRecruitmentInformation;

    public Club() {
        this.name = "";
        this.category = "";
        this.division = "";
        this.state = ClubState.UNAVAILABLE;
        this.clubRecruitmentInformation = ClubRecruitmentInformation.builder().build();
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
        this.name = request.name();
        this.category = request.category();
        this.division = request.division();
        this.state = ClubState.AVAILABLE;

        this.clubRecruitmentInformation = ClubRecruitmentInformation.builder()
            .presidentName(request.clubPresidentName())
            .presidentTelephoneNumber(request.telephoneNumber())
            .introduction(request.introduction())
            .recruitmentStart(request.recruitmentStart())
            .recruitmentEnd(request.recruitmentEnd())
            .recruitmentTarget(request.recruitmentTarget())
            .tags(request.tags())
            .build();
    }

    public void update(ClubDescriptionUpdateRequest request) {
        clubRecruitmentInformation.updateDescription(request);
    }

    public void updateLogo(String logo) {
        this.clubRecruitmentInformation.updateLogo(logo);
    }

    public void updateFeedImages(List<String> feedImages) {
        this.clubRecruitmentInformation.updateFeedImages(feedImages);
    }
}
