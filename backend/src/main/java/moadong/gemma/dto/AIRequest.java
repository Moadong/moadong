package moadong.gemma.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

public record AIRequest(
        String model,
        String system,
        String prompt,
        String format,
        boolean stream,
        @JsonProperty("keep_alive") int keepAlive,
        AIOptions options
) {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record AIOptions(
            @JsonProperty("num_ctx")      Integer numCtx,       // Context Window Size
            @JsonProperty("temperature")  Double temperature,   // 창의성 조절
            @JsonProperty("num_predict")  Integer numPredict,   // 최대 출력 토큰 수
            @JsonProperty("top_p")        Double topP,          // 확률 분포 조절
            @JsonProperty("repeat_penalty") Double repeatPenalty // 반복 제어
    ) {
    }
}
