package moadong.club.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminExternalFormConnectRequest(
        @Size(max = 50)
        String title,

        @NotBlank
        String externalApplicationUrl,

        @NotNull
        @Min(2000)
        @Max(2999)
        Integer semesterYear
) {
    public String titleOrDefault() {
        return (title == null || title.isBlank()) ? "외부 지원폼" : title;
    }
}
