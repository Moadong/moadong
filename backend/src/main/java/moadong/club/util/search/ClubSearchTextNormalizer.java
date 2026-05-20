package moadong.club.util.search;

import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class ClubSearchTextNormalizer {

    public String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.trim()
                .replaceAll("\\s+", "")
                .toLowerCase(Locale.ROOT);
    }
}
