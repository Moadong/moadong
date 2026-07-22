package moadong.club.service;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubDescription;
import moadong.club.entity.ClubIdealCandidate;
import moadong.club.entity.ClubRecruitmentInformation;

public final class AiDraftPrompts {

    private AiDraftPrompts() {
    }

    public static final String SYSTEM = """
            ### Role
            너는 대학교 동아리의 신입 부원 모집 지원서를 설계하는 전문가다.

            ### Task
            [Club] 정보를 읽고 이 동아리의 성격에 맞는 지원서 질문을 만들어라.
            - 이름/연락처/학과 같은 공통 질문은 이미 있으므로 절대 만들지 말 것.
            - 이 동아리만의 특성(활동 내용, 분야, 분위기)이 드러나는 질문을 만들 것. 개수는 동아리 성격과 정보량에 맞게 스스로 판단할 것(정보가 풍부하면 더 많이, 부실하면 적게).

            ### Rules
            1. title: 핵심 질문만 간결하게. 반드시 30자 이내. 부연 설명은 title에 넣지 말고 description에 넣을 것.
            2. description: 답변 안내 문구, 200자 이내. 없어도 되면 빈 문자열.
            3. 모든 문장은 존댓말(해요체 또는 합쇼체)로 작성할 것. 반말 금지.
            4. type: SHORT_TEXT(단답), LONG_TEXT(장문), CHOICE(단일선택), MULTI_CHOICE(복수선택) 중 하나.
            5. 질문 중 최소 1개는 CHOICE 또는 MULTI_CHOICE로 만들 것. items에 선택지(각 20자 이내, 2~5개)를 넣을 것. SHORT_TEXT/LONG_TEXT는 items를 빈 배열로.
            6. 선택지에는 실존하는 팀명·인물·작품명·전문용어를 나열하지 말 것. 동아리 정보에 언급된 내용이나 일반적인 항목(관심 분야, 경험 수준, 참여 가능 시간 등)만 사용할 것.
            7. required: 필수 여부 (true/false).
            8. 지원 동기를 묻는 질문과 동아리 특성을 묻는 질문을 함께 포함할 것.
            9. 지원자가 부담 없이 답할 수 있는 친근한 난이도로 만들 것. 전문 지식을 시험하는 질문 금지.
            """;

    public static String buildUserPrompt(Club club) {
        ClubRecruitmentInformation info = club.getClubRecruitmentInformation();
        ClubDescription desc = club.getClubDescription();
        ClubIdealCandidate ideal = desc == null ? null : desc.getIdealCandidate();

        return "### Club\n"
                + "- 이름: " + orNone(club.getName()) + "\n"
                + "- 분류: " + orNone(club.getDivision()) + " / " + orNone(club.getCategory()) + "\n"
                + "- 태그: " + joinOrNone(info == null ? null : info.getTags()) + "\n"
                + "- 한줄소개: " + orNone(info == null ? null : info.getIntroduction()) + "\n"
                + "- 소개: " + orNone(desc == null ? null : desc.getIntroDescription()) + "\n"
                + "- 활동내용: " + orNone(desc == null ? null : desc.getActivityDescription()) + "\n"
                + "- 인재상: " + orNone(ideal == null ? null : ideal.getContent()) + "\n"
                + "- 혜택: " + orNone(desc == null ? null : desc.getBenefits());
    }

    private static String orNone(String value) {
        return (value == null || value.isBlank()) ? "(없음)" : value;
    }

    private static String joinOrNone(List<String> values) {
        return (values == null || values.isEmpty()) ? "(없음)" : String.join(", ", values);
    }
}
