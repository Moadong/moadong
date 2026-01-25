package moadong.log.club.payload.response;

import lombok.Builder;
import lombok.Getter;
import moadong.club.entity.Club;
import moadong.club.enums.ClubRecruitmentStatus;
import org.javers.shadow.Shadow;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Getter
@Builder
public class ClubHistoryResponse {
    // 1. 메타데이터 (버전 정보)
    private long version;
    private LocalDateTime modifiedAt;
    private String modifiedBy;

    // 2. Club 엔티티 주요 데이터
    private String name;
    private String division;
    private String category;
    private String state; // Enum -> String 변환 권장

    // 3. ClubRecruitmentInformation 주요 데이터 (DiffIgnore 제외된 것들)
    private String introduction;
    private String presidentName;
    private String recruitmentTarget;
    private ClubRecruitmentStatus recruitmentStatus;
    private LocalDateTime recruitmentStart;
    private LocalDateTime recruitmentEnd;

    // tags는 DiffIgnore가 없으므로 포함
    private List<String> tags;

    // 4. 안전한 변환 메서드 (Factory Method)
    public static ClubHistoryResponse from(Shadow<Club> shadow) {
        Club club = shadow.get();
        var metadata = shadow.getCommitMetadata();

        // 중첩 객체 Null 방어 로직
        var recruitmentInfo = club.getClubRecruitmentInformation();
        boolean hasInfo = recruitmentInfo != null;

        return ClubHistoryResponse.builder()
                .version(metadata.getId().getMajorId())
                .modifiedAt(metadata.getCommitDate())
                .modifiedBy(metadata.getAuthor())

                // Club 필드 매핑
                .name(club.getName())
                .division(club.getDivision())
                .category(club.getCategory())
                .state(club.getState() != null ? club.getState().name() : null)

                // RecruitmentInfo 필드 매핑 (Null Safe)
                .introduction(hasInfo ? recruitmentInfo.getIntroduction() : null)
                .presidentName(hasInfo ? recruitmentInfo.getPresidentName() : null)
                .recruitmentTarget(hasInfo ? recruitmentInfo.getRecruitmentTarget() : null)
                .recruitmentStatus(hasInfo ? recruitmentInfo.getClubRecruitmentStatus() : null)

                // 시간 타입 변환 (Instant -> LocalDateTime 등 필요시)
                .recruitmentStart(hasInfo && recruitmentInfo.getRecruitmentStart() != null
                        ? recruitmentInfo.getRecruitmentStart().toLocalDateTime()
                        : null)
                .recruitmentEnd(hasInfo && recruitmentInfo.getRecruitmentEnd() != null
                        ? recruitmentInfo.getRecruitmentEnd().toLocalDateTime()
                        : null)

                // 리스트 필드 Null 방어
                .tags(hasInfo && recruitmentInfo.getTags() != null
                        ? recruitmentInfo.getTags()
                        : Collections.emptyList())

                .build();
    }
}