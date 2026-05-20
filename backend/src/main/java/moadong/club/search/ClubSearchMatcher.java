package moadong.club.search;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import moadong.club.payload.dto.ClubSearchResult;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClubSearchMatcher {

    private final ClubSearchTextNormalizer normalizer;
    private final KoreanInitialExtractor initialExtractor;
    private final EditDistanceCalculator editDistanceCalculator;

    public Optional<ClubSearchCandidate> match(
            ClubSearchResult club,
            String keyword,
            List<String> expandedKeywords
    ) {
        String normalizedKeyword = normalizer.normalize(keyword);
        if (normalizedKeyword.isEmpty() || club == null) {
            return Optional.empty();
        }

        String normalizedName = normalizer.normalize(club.name());

        if (normalizedName.equals(normalizedKeyword)) {
            return Optional.of(new ClubSearchCandidate(club, ClubSearchMatchType.EXACT, 0));
        }

        if (normalizedName.startsWith(normalizedKeyword)) {
            return Optional.of(new ClubSearchCandidate(
                    club,
                    ClubSearchMatchType.PREFIX,
                    normalizedName.length() - normalizedKeyword.length()
            ));
        }

        int substringIndex = normalizedName.indexOf(normalizedKeyword);
        if (substringIndex >= 0) {
            return Optional.of(new ClubSearchCandidate(
                    club,
                    ClubSearchMatchType.SUBSTRING,
                    substringIndex
            ));
        }

        if (initialExtractor.isInitialsOnly(normalizedKeyword)) {
            String nameInitials = initialExtractor.extractInitials(normalizedName);
            if (nameInitials.startsWith(normalizedKeyword)) {
                return Optional.of(new ClubSearchCandidate(
                        club,
                        ClubSearchMatchType.CHOSEONG,
                        nameInitials.length() - normalizedKeyword.length()
                ));
            }
        }

        Optional<ClubSearchCandidate> fuzzyCandidate = matchFuzzy(club, normalizedKeyword, normalizedName);
        if (fuzzyCandidate.isPresent()) {
            return fuzzyCandidate;
        }

        if (matchesSemantic(club, expandedKeywords)) {
            return Optional.of(new ClubSearchCandidate(club, ClubSearchMatchType.SEMANTIC, 0));
        }

        return Optional.empty();
    }

    private Optional<ClubSearchCandidate> matchFuzzy(
            ClubSearchResult club,
            String normalizedKeyword,
            String normalizedName
    ) {
        if (normalizedKeyword.length() < 2 || normalizedName.isEmpty()) {
            return Optional.empty();
        }

        if (!hasSameFirstLetterOrInitial(normalizedKeyword, normalizedName)) {
            return Optional.empty();
        }

        int distance = editDistanceCalculator.minDistanceAgainstName(normalizedKeyword, normalizedName);
        int allowedDistance = normalizedKeyword.length() <= 3 ? 1 : 2;
        if (distance <= allowedDistance) {
            return Optional.of(new ClubSearchCandidate(club, ClubSearchMatchType.FUZZY, distance));
        }
        return Optional.empty();
    }

    private boolean hasSameFirstLetterOrInitial(String normalizedKeyword, String normalizedName) {
        if (normalizedKeyword.charAt(0) == normalizedName.charAt(0)) {
            return true;
        }

        return initialExtractor.firstComparableChar(normalizedKeyword)
                == initialExtractor.firstComparableChar(normalizedName);
    }

    private boolean matchesSemantic(ClubSearchResult club, List<String> expandedKeywords) {
        if (expandedKeywords == null || expandedKeywords.isEmpty()) {
            return false;
        }

        for (String keyword : expandedKeywords) {
            String normalizedExpandedKeyword = normalizer.normalize(keyword);
            if (normalizedExpandedKeyword.isEmpty()) {
                continue;
            }

            if (matchesField(club.category(), normalizedExpandedKeyword)) {
                return true;
            }

            if (club.tags() == null) {
                continue;
            }

            for (String tag : club.tags()) {
                if (matchesField(tag, normalizedExpandedKeyword)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean matchesField(String value, String normalizedKeyword) {
        String normalizedValue = normalizer.normalize(value);
        return normalizedValue.equals(normalizedKeyword) || normalizedValue.contains(normalizedKeyword);
    }
}
