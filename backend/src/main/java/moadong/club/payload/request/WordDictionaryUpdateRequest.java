package moadong.club.payload.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record WordDictionaryUpdateRequest(
    @NotEmpty(message = "입력단어 목록은 비어있을 수 없습니다")
    List<String> inputWords
) {
}
