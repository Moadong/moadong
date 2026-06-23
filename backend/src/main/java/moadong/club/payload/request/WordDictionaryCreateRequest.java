package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record WordDictionaryCreateRequest(
    @NotBlank(message = "표준단어는 필수입니다")
    String standardWord,
    
    @NotEmpty(message = "입력단어 목록은 비어있을 수 없습니다")
    List<String> inputWords
) {
}
