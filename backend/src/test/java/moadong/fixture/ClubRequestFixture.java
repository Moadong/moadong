package moadong.fixture;

import moadong.club.payload.request.ClubInfoRequest;

import java.util.List;
import java.util.Map;

public class ClubRequestFixture {
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
                Map.of("insta", "https://test")
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
