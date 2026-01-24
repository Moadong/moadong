package moadong.club.payload.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record WordDictionaryBulkCreateRequest(
    @NotEmpty(message = "단어사전 목록은 비어있을 수 없습니다")
    List<WordDictionaryCreateRequest> wordDictionaries
) {
}
