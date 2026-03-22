package moadong.calendar.notion.payload.request;

import jakarta.validation.constraints.NotBlank;

public record NotionTokenExchangeRequest(
        @NotBlank String code
) {
}