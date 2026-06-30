package moadong.media.webhook.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ImageConversionCompletedRequest(
        @NotNull String event,
        Integer processed_count,
        Integer failed_count,
        @NotNull List<@Valid ImageEntry> images
) {
}
