package moadong.club.util.search;

import org.springframework.stereotype.Component;

@Component
public class KoreanInitialExtractor {

    private static final char HANGUL_BASE = 0xAC00;
    private static final char HANGUL_LAST = 0xD7A3;
    private static final int JUNGSEONG_COUNT = 21;
    private static final int JONGSEONG_COUNT = 28;
    private static final char[] INITIALS = {
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
            'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    };

    public String extractInitials(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }

        StringBuilder result = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char ch = value.charAt(i);
            result.append(extractInitial(ch));
        }
        return result.toString();
    }

    public boolean isInitialsOnly(String value) {
        if (value == null || value.isEmpty()) {
            return false;
        }

        for (int i = 0; i < value.length(); i++) {
            if (!isInitial(value.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    public char firstComparableChar(String value) {
        if (value == null || value.isEmpty()) {
            return '\0';
        }
        return extractInitial(value.charAt(0));
    }

    private char extractInitial(char ch) {
        if (ch < HANGUL_BASE || ch > HANGUL_LAST) {
            return ch;
        }

        int index = (ch - HANGUL_BASE) / (JUNGSEONG_COUNT * JONGSEONG_COUNT);
        return INITIALS[index];
    }

    private boolean isInitial(char ch) {
        for (char initial : INITIALS) {
            if (initial == ch) {
                return true;
            }
        }
        return false;
    }
}
