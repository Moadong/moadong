package moadong.club.payload.response;

import java.util.List;

public record ClubApplicationDraftResponse(
        String title,
        String description,
        List<QuestionDto> questions,
        boolean aiGenerated,
        int remaining
) {
    public record QuestionDto(
            long id,
            String title,
            String description,
            String type,
            OptionsDto options,
            List<ItemDto> items
    ) {
    }

    public record OptionsDto(boolean required) {
    }

    public record ItemDto(String value) {
    }
}
