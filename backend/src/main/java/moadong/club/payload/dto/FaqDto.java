package moadong.club.payload.dto;

import jakarta.validation.constraints.Size;
import moadong.club.entity.Faq;

public record FaqDto(
    @Size(max = 100)
    String question,
    
    @Size(max = 500)
    String answer
) {
    public static FaqDto from(Faq faq) {
        if (faq == null) return null;
        return new FaqDto(faq.getQuestion(), faq.getAnswer());
    }

    public Faq toEntity() {
        return new Faq(question, answer);
    }
}
