package moadong.feedback.prompt.enums;

public enum FeedbackPromptTriggerType {
    ADMIN_CLUB_BASIC_INFO_CREATED,
    ADMIN_CLUB_INFO_UPDATED,
    ADMIN_RECRUITMENT_INFO_SAVED,
    USER_CLUB_DETAIL_EXIT,
    GENERAL_FEEDBACK;

    public boolean isAdminTrigger() {
        return name().startsWith("ADMIN_");
    }

    public boolean isUserTrigger() {
        return name().startsWith("USER_") || this == GENERAL_FEEDBACK;
    }
}
