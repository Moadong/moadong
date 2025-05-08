package moadong.fixture;

import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.enums.ClubState;
import moadong.club.payload.request.ClubInfoRequest;
import moadong.club.payload.request.ClubRecruitmentInfoUpdateRequest;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class ClubFixture {
    public static final ClubState DEFAULT_STATE = ClubState.UNAVAILABLE;
    public static Club createClub() {
        return Club.builder()
                .name("테스트 동아리")
                .category("학술")
                .division("프로그래밍")
                .clubRecruitmentInformation(createRecruitmentInfo())
                .build();
    }

    public static ClubRecruitmentInformation createRecruitmentInfo() {
        return ClubRecruitmentInformation.builder()
                .id("recruit_789")
                .logo("logo.png")
                .introduction("우수한 개발 동아리")
                .description("개발 문화를 선도하는 동아리입니다.")
                .presidentName("홍길동")
                .presidentTelephoneNumber("010-1234-5678")
                .recruitmentStart(LocalDateTime.now().plusDays(1))
                .recruitmentEnd(LocalDateTime.now().plusDays(7))
                .recruitmentTarget("1~2학년")
                .feedImages(List.of("image1.jpg", "image2.jpg"))
                .tags(List.of("개발", "프로그래밍", "스터디"))
                .clubRecruitmentStatus(ClubRecruitmentStatus.OPEN)
                .recruitmentForm("https://forms.example.com")
                .build();
    }

    public static ClubInfoRequest createValidClubInfoRequest() {
        return new ClubInfoRequest(
                "club_123",
                "테스트동아리",
                "학술",
                "프로그래밍",
                List.of("개발", "스터디"),
                "동아리 소개입니다.",
                "홍길동",
                "010-1234-5678",
                "https://forms.gle/abcd"
        );

    }
    //ToDo: 시간 계산법을 LocalDateTime에서 Instant로 변경 후에 활성화할 것
//    public static ClubRecruitmentInfoUpdateRequest createValidRequest() {
//        return new ClubRecruitmentInfoUpdateRequest(
//                "club_123",
//                Instant.now().plus(1, ChronoUnit.DAYS),  // 1일 후
//                Instant.now().plus(7, ChronoUnit.DAYS),   // 7일 후
//                "1~3학년",
//                "새로운 모집 설명입니다."
//        );
//    }
//
//    // 커스텀 파라미터로 생성
//    public static ClubRecruitmentInfoUpdateRequest createCustomRequest(
//            String id,
//            Instant start,
//            Instant end,
//            String target,
//            String description
//    ) {
//        return new ClubRecruitmentInfoUpdateRequest(
//                id,
//                start,
//                end,
//                target,
//                description
//        );
//    }
}