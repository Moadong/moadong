package moadong.media.domain;

import lombok.Getter;

@Getter
public enum FileType {
    LOGO("logo"),
    FEED("feed");

    // 저장된 값 리턴
    private final String path;

    FileType(String path) {
        this.path = path;  // 생성자로 전달된 값 저장
    }

}
