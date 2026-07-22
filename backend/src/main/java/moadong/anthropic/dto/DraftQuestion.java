package moadong.anthropic.dto;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import java.util.List;

public record DraftQuestion(
        @JsonPropertyDescription("질문 제목, 한국어 30자 이내")
        String title,
        @JsonPropertyDescription("답변 안내 문구, 200자 이내, 없으면 빈 문자열")
        String description,
        @JsonPropertyDescription("SHORT_TEXT | LONG_TEXT | CHOICE | MULTI_CHOICE 중 하나")
        String type,
        @JsonPropertyDescription("CHOICE/MULTI_CHOICE의 선택지(각 20자 이내). 그 외 타입은 빈 배열")
        List<String> items,
        @JsonPropertyDescription("필수 응답 여부")
        boolean required
) {
}
