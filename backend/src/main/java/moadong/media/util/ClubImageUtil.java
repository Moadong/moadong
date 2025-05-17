package moadong.media.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class ClubImageUtil {

    public static boolean containsKoreanOrBlank(String text) {
        text = Normalizer.normalize(text, Normalizer.Form.NFC);
        return Pattern.matches(".*([ㄱ-ㅎㅏ-ㅣ가-힣]|\\s)+.*", text);
    }
}
