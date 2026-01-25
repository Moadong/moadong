package moadong.media.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record FeedUpdateRequest(
        @NotNull
        List<String> feeds
) {
}
