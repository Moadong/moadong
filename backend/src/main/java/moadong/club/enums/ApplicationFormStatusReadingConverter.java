package moadong.club.enums;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;

/**
 * DB에 저장된 status 문자열을 {@link ApplicationFormStatus}로 읽어들일 때 사용한다.
 * ACTIVE 외의 값(레거시 PUBLISHED/UNPUBLISHED 포함)은 모두 INACTIVE로 흡수한다.
 * enum을 2-state로 축소한 뒤에도 기존 문서를 안전하게 역직렬화하기 위한 컨버터.
 */
@ReadingConverter
public class ApplicationFormStatusReadingConverter implements Converter<String, ApplicationFormStatus> {

    @Override
    public ApplicationFormStatus convert(String source) {
        return "ACTIVE".equals(source) ? ApplicationFormStatus.ACTIVE : ApplicationFormStatus.INACTIVE;
    }
}
