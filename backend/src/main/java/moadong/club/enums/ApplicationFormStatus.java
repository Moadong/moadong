package moadong.club.enums;

public enum ApplicationFormStatus {
    ACTIVE, //현재 게시 중
    PUBLISHED, //게시된 적 있음
    UNPUBLISHED; //게시된 적 없음

    public static ApplicationFormStatus fromFlag(ApplicationFormStatus current, boolean activeFlag) {

        if (current == null) current = UNPUBLISHED;

        if (activeFlag) { return ACTIVE; }

        return (current == ACTIVE) ? PUBLISHED : current;
    }
}
