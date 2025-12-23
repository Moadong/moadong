package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.club.payload.dto.FaqDto;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Faq {
    String question;
    String answer;

    public static Faq from(FaqDto dto) {
        if (dto == null) return null;
        return new Faq(dto.question(), dto.answer());
    }
}
