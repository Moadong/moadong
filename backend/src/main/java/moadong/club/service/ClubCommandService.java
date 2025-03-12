package moadong.club.service;

import java.util.List;
import lombok.AllArgsConstructor;
import moadong.club.entity.Club;
import moadong.club.entity.ClubInformation;
import moadong.club.entity.ClubTag;
import moadong.club.payload.request.ClubCreateRequest;
import moadong.club.payload.request.ClubDescriptionUpdateRequest;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.repository.ClubInformationRepository;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubTagRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClubCommandService {

    private final ClubRepository clubRepository;
    private final ClubInformationRepository clubInformationRepository;
    private final ClubTagRepository clubTagRepository;
    private final RecruitmentScheduler recruitmentScheduler;

    public String createClub(ClubCreateRequest request) {
        Club club = Club.builder()
            .name(request.name())
            .category(request.category())
            .division(request.division())
            .build();
        clubRepository.save(club);

        ClubInformation clubInformation = ClubInformation.builder()
            .clubId(club.getId())
            .build();
        clubInformationRepository.save(clubInformation);

        return club.getId();
    }

    public String updateClubInfo(ClubInfoRequest request) {
        Club club = clubRepository.findById(request.clubId())
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        ClubInformation clubInformation = clubInformationRepository.findByClubId(request.clubId())
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND));

        club.update(request);
        clubRepository.save(club);

        clubInformation.updateInfo(request);
        clubInformationRepository.save(clubInformation);

        //태그
        clubTagRepository.deleteAllByClubId(club.getId());
        List<String> tags = request.tags();
        for (String tag : tags) {
            ClubTag newTag = ClubTag.builder()
                .clubId(club.getId())
                .tag(tag)
                .build();
            clubTagRepository.save(newTag);
        }

        //모집일정을 동적스케쥴러에 달아둠
        recruitmentScheduler.scheduleRecruitment(club.getId(), request.recruitmentStart(),
            request.recruitmentEnd());

        return club.getId();
    }

    public void updateClubDescription(ClubDescriptionUpdateRequest request) {
        ClubInformation clubInformation = clubInformationRepository.findByClubId(request.clubId())
            .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_INFORMATION_NOT_FOUND));
        clubInformation.updateDescription(request);
        clubInformationRepository.save(clubInformation);
    }
}
