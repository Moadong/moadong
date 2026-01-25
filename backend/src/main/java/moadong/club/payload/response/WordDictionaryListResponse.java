package moadong.club.payload.response;

import java.util.List;

public record WordDictionaryListResponse(
    long total,
    List<WordDictionaryResponse> wordDictionaries
) {
}
