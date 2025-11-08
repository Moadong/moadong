package moadong.gemma.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AIResponse(@JsonProperty("response") String response) {
}