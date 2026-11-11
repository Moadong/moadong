package moadong.club.enums;

public enum ApplicationFormStatus {
    ACTIVE, //현재 게시 중 (활성)
    INACTIVE; //비활성

    public static ApplicationFormStatus fromFlag(boolean activeFlag) {
        return activeFlag ? ACTIVE : INACTIVE;
    }
}
