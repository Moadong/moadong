package moadong.gemma.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AIRequest(
        String model,
        String prompt,
        String format,
        boolean stream,
        @JsonProperty("keep_alive") int keepAlive
) {
}
