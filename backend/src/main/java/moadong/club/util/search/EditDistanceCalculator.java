package moadong.club.util.search;

import org.springframework.stereotype.Component;

@Component
public class EditDistanceCalculator {

    public int distance(String source, String target) {
        String left = source == null ? "" : source;
        String right = target == null ? "" : target;

        int[][] dp = new int[left.length() + 1][right.length() + 1];
        for (int i = 0; i <= left.length(); i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= right.length(); j++) {
            dp[0][j] = j;
        }

        for (int i = 1; i <= left.length(); i++) {
            for (int j = 1; j <= right.length(); j++) {
                int cost = left.charAt(i - 1) == right.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[left.length()][right.length()];
    }

    public int minDistanceAgainstName(String keyword, String normalizedName) {
        if (normalizedName == null || keyword == null) {
            return distance(keyword, normalizedName);
        }

        int wholeDistance = distance(keyword, normalizedName);
        if (normalizedName.length() <= keyword.length()) {
            return wholeDistance;
        }

        String prefixWindow = normalizedName.substring(0, keyword.length());
        return Math.min(wholeDistance, distance(keyword, prefixWindow));
    }
}
