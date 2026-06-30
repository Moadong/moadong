package moadong.club.payload.response;

import java.util.List;

public record WordDictionaryResponse(
    String id,
    String standardWord,
    List<String> inputWords
) {
}
