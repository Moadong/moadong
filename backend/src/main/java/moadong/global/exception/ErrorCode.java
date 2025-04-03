package moadong.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    CLUB_NOT_FOUND(HttpStatus.NOT_FOUND, "600-1", "동아리가 존재하지 않습니다."),
    CLUB_INFORMATION_NOT_FOUND(HttpStatus.NOT_FOUND, "600-2", "동아리 상세 정보가 존재하지 않습니다."),
    CLUB_FEED_IMAGES_NOT_FOUND(HttpStatus.NOT_FOUND, "600-3", "동아리 피드가 존재하지 않습니다."),
    IMAGE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-1", "이미지 업로드에 실패하였습니다."),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "601-2", "이미지 파일을 찾을 수 없습니다."),
    TOO_MANY_FILES(HttpStatus.PAYLOAD_TOO_LARGE, "601-3", "이미지 파일이 최대치보다 많습니다."),
    IMAGE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-4", "이미지 삭제에 실패하였습니다"),
    KOREAN_FILE_NAME(HttpStatus.INTERNAL_SERVER_ERROR, "601-5", "파일명의 한국어를 인코딩할 수 없습니다."),
    USER_ALREADY_EXIST(HttpStatus.BAD_REQUEST, "700-1","이미 존재하는 계정입니다."),
    USER_NOT_EXIST(HttpStatus.BAD_REQUEST, "700-2","존재하지 않는 계정입니다."),
    USER_INVALID_FORMAT(HttpStatus.BAD_REQUEST, "700-3","올바르지 않은 유저 형식입니다."),
    USER_INVALID_LOGIN(HttpStatus.BAD_REQUEST, "700-4","올바르지 않은 로그인"),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "701-1", "올바르지 않은 토큰 양식입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "701-2", "토큰이 만료되었습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}
