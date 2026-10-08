package moadong.user.util;

import java.util.List;
import java.util.Random;

public class NicknameGenerator {

    private static final List<String> ADJECTIVES = List.of(
            "활발한", "씩씩한", "귀여운", "용감한", "똑똑한",
            "따뜻한", "신나는", "행복한", "밝은", "멋진",
            "재밌는", "다정한", "엉뚱한", "느긋한", "유쾌한",
            "숨겨진", "수상한", "졸린", "배고픈", "도도한",
            "당황한", "삐진", "억울한", "설레는", "뿌듯한",
            "심심한", "깜찍한", "부끄러운", "황당한", "새침한",
            "철없는", "눈치없는", "진지한", "어리둥절한", "투덜대는",
            "겁많은", "소심한", "덜렁대는", "어설픈", "늦잠자는"
    );

    private static final List<String> NOUNS = List.of(
            "고양이", "강아지", "판다", "토끼", "햄스터",
            "펭귄", "북극곰", "여우", "다람쥐", "코알라",
            "수달", "오리", "독수리", "사자", "호랑이",
            "오징어", "문어", "거북이", "미어캣", "카피바라",
            "알파카", "플라밍고", "악어", "하마", "기린",
            "두더지", "낙타", "비버", "너구리", "올빼미",
            "앵무새", "나무늘보", "망아지", "고슴도치", "라쿤",
            "물개", "원숭이", "사막여우", "바다사자", "족제비"
    );

    private static final List<String> RARE_PREFIXES = List.of(
            "전설의", "우주의", "소문난", "비밀", "세상에서 제일",
            "어쩌다", "갑자기", "몰래", "신기하게도"
    );

    private static final int RARE_THRESHOLD = 10;

    private static final Random RANDOM = new Random();

    private NicknameGenerator() {}

    public static String generate() {
        String adjective = ADJECTIVES.get(RANDOM.nextInt(ADJECTIVES.size()));
        String noun = NOUNS.get(RANDOM.nextInt(NOUNS.size()));

        if (RANDOM.nextInt(100) < RARE_THRESHOLD) {
            String prefix = RARE_PREFIXES.get(RANDOM.nextInt(RARE_PREFIXES.size()));
            return prefix + " " + adjective + " " + noun;
        }

        return adjective + " " + noun;
    }
}
