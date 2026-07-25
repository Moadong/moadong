package moadong.club.entity;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.data.annotation.Version;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

@Document("club_application_forms")
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ClubApplicationForm implements Persistable<String> {
    private static final Set<String> externalApplicationUrlAllowedHosts = Set.of("forms.gle", "docs.google.com", "form.naver.com", "naver.me", "everytime.kr", "cafe.daum.net", "open.kakao.com");
    private static final String GOOGLE_DOCS_HOST = "docs.google.com";
    private static final String GOOGLE_FORMS_PATH_PREFIX = "/forms";

    @Id
    private String id;

    private String clubId;

    @NotNull
    @Builder.Default
    private String title = "";

    @NotNull
    @Builder.Default
    private String description = "";

    @Builder.Default
    private List<ClubApplicationFormQuestion> questions = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    @Builder.Default
    private LocalDateTime editedAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();

    @NotNull
    @Builder.Default
    private Integer semesterYear = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDate().getYear();

    @Builder.Default
    private ApplicationFormStatus status = ApplicationFormStatus.INACTIVE;

    @NotNull
    @Builder.Default
    private ApplicationFormMode formMode = ApplicationFormMode.INTERNAL;

    @Builder.Default
    private String externalApplicationUrl = "";

    @Version
    private Long version;

    public ApplicationFormMode getFormMode() {
        return Optional.ofNullable(this.formMode).orElse(ApplicationFormMode.INTERNAL);
    }

    public void updateFormTitle(String title) {
        this.title = title;
    }

    public void updateFormDescription(String description) {
        this.description = description;
    }

    public void updateQuestions(List<ClubApplicationFormQuestion> newQuestions) {
        this.questions.clear();
        this.questions.addAll(newQuestions);
    }

    public void updateEditedAt() {
       this.editedAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();
    }

    public void updateSemesterYear(Integer semesterYear) {
        this.semesterYear = semesterYear;
    }

    public void updateFormStatus(boolean activeFlag) {
        this.status = ApplicationFormStatus.fromFlag(activeFlag);
    }

    public void updateFormMode(ApplicationFormMode formMode) {
        this.formMode = formMode;
    }

    public void updateExternalApplicationUrl(String externalApplicationUrl) {
        String trimmed = externalApplicationUrl.trim();

        if (!isAllowedExternalUrl(trimmed)) {
            throw new RestApiException(ErrorCode.NOT_ALLOWED_EXTERNAL_URL);
        }

        this.externalApplicationUrl = trimmed;
    }

    /**
     * prefix 비교는 {@code https://forms.gle@evil.example}(userinfo)나
     * {@code https://forms.gle.evil.example}(suffix) 형태로 우회되므로 URI를 파싱해 host를 정확히 대조한다.
     */
    private static boolean isAllowedExternalUrl(String url) {
        URI uri;
        try {
            uri = new URI(url);
        } catch (URISyntaxException e) {
            return false;
        }

        if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getUserInfo() != null) {
            return false;
        }

        String host = uri.getHost();
        if (host == null) {
            return false;
        }
        host = host.toLowerCase(Locale.ROOT);
        if (!externalApplicationUrlAllowedHosts.contains(host)) {
            return false;
        }

        if (GOOGLE_DOCS_HOST.equals(host)) {
            String path = uri.getPath();
            return path != null && path.startsWith(GOOGLE_FORMS_PATH_PREFIX);
        }

        return true;
    }

    @Override
    public boolean isNew() {
        return this.version == null;
    }
}
