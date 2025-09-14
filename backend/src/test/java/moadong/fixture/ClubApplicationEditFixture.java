package moadong.fixture;

import java.util.ArrayList;
import moadong.club.payload.request.ClubApplicationEditRequest;

public class ClubApplicationEditFixture {
    public static ClubApplicationEditRequest createClubApplicationEditRequest(){
//        ClubApplyQuestion clubApplyQuestion = new ClubApplyQuestion(

//                1,
//                "타이틀",
//                "설명",
//                ClubApplicationQuestionType.CHOICE,
//                new ClubApplyQuestion.Options(false),
//                new ArrayList<>()
//        );
        return new ClubApplicationEditRequest(
                "테스트123",
                "테스트 지원서입니다",
                new ArrayList<>()
        );
    }
}
