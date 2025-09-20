package moadong.fixture;

import moadong.club.payload.request.ClubApplicationFormEditRequest;
import java.util.ArrayList;

public class ClubApplicationEditFixture {
    public static ClubApplicationFormEditRequest createClubApplicationEditRequest(){
//        ClubApplyQuestion clubApplyQuestion = new ClubApplyQuestion(

//                1,
//                "타이틀",
//                "설명",
//                ClubApplicationQuestionType.CHOICE,
//                new ClubApplyQuestion.Options(false),
//                new ArrayList<>()
//        );
        return new ClubApplicationFormEditRequest(
                "테스트123",
                "테스트 지원서입니다",
                new ArrayList<>()
        );
    }
}
