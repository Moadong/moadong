package moadong.media.enums;

import lombok.Getter;

@Getter
public enum PlatformType {
    WEB("WEB"),
    APP_HOME("APP_HOME");

    private final String type;

    PlatformType(String type) {
        this.type = type;
    }

}
