package moadong.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    CONCURRENCY_CONFLICT(HttpStatus.CONFLICT, "100-1","다른 사용자가 먼저 수정했습니다. 페이지를 새로고침 후 다시 이용해주세요"),
    CLUB_NOT_FOUND(HttpStatus.NOT_FOUND, "600-1", "동아리가 존재하지 않습니다."),
    CLUB_INFORMATION_NOT_FOUND(HttpStatus.NOT_FOUND, "600-2", "동아리 상세 정보가 존재하지 않습니다."),
    CLUB_FEED_IMAGES_NOT_FOUND(HttpStatus.NOT_FOUND, "600-3", "동아리 피드가 존재하지 않습니다."),
    CLUB_ID_INVALID(HttpStatus.BAD_REQUEST, "600-4", "올바르지 않은 클럽 요청입니다."),
    CLUB_SEARCH_FAILED(HttpStatus.BAD_REQUEST, "600-5", "검색 중 오류가 발생했습니다."),
    CLUB_DIVISION_INVALID(HttpStatus.BAD_REQUEST, "600-6", "올바르지 않은 분과입니다."),
    CLUB_CATEGORY_INVALID(HttpStatus.BAD_REQUEST, "600-7", "올바르지 않은 분류입니다."),
    TOO_MANY_TAGS(HttpStatus.BAD_REQUEST, "600-8", "태그는 최대 3개까지 입력할 수 있습니다."),
    TOO_LONG_TAG(HttpStatus.BAD_REQUEST, "600-9", "태그는 최대 5글자까지 입력할 수 있습니다."),
    TOO_LONG_INTRODUCTION(HttpStatus.BAD_REQUEST, "600-10", "소개는 최대 24글자까지 입력할 수 있습니다."),

    IMAGE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-1", "이미지 업로드에 실패하였습니다."),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "601-2", "이미지 파일을 찾을 수 없습니다."),
    TOO_MANY_FILES(HttpStatus.PAYLOAD_TOO_LARGE, "601-3", "이미지 파일이 최대치보다 많습니다."),
    IMAGE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-4", "이미지 삭제에 실패하였습니다"),
    KOREAN_FILE_NAME(HttpStatus.INTERNAL_SERVER_ERROR, "601-5", "파일명의 한국어를 인코딩할 수 없습니다."),
    FILE_TRANSFER_ERROR(HttpStatus.BAD_REQUEST, "601-6", "파일을 올바른 형식으로 변경할 수 없습니다."),
    UNSUPPORTED_FILE_TYPE(HttpStatus.BAD_REQUEST, "601-7", "파일의 확장자가 올바르지 않습니다."),

    USER_ALREADY_EXIST(HttpStatus.BAD_REQUEST, "700-1", "이미 존재하는 계정입니다."),
    USER_NOT_EXIST(HttpStatus.BAD_REQUEST, "700-2", "존재하지 않는 계정입니다."),
    USER_INVALID_FORMAT(HttpStatus.BAD_REQUEST, "700-3", "올바르지 않은 유저 형식입니다."),
    USER_INVALID_LOGIN(HttpStatus.BAD_REQUEST, "700-4", "올바르지 않은 로그인"),
    USER_UNAUTHORIZED(HttpStatus.FORBIDDEN, "700-5", "권한이 없습니다."),

    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "701-1", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "701-2", "토큰이 만료되었습니다."),

    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "800-1", "지원서가 존재하지 않습니다."),
    SHORT_EXCEED_LENGTH(HttpStatus.BAD_REQUEST, "800-2", "단답형 최대 글자를 초과하였습니다."),
    LONG_EXCEED_LENGTH(HttpStatus.BAD_REQUEST, "800-3", "장문형 최대 글자를 초과하였습니다."),
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "800-4", "존재하지 않은 질문입니다."),
    REQUIRED_QUESTION_MISSING(HttpStatus.BAD_REQUEST, "800-5", "필수 응답 질문이 누락되었습니다."),

    AES_CIPHER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "900-1", "암호화 중 오류가 발생했습니다."),
    APPLICANT_NOT_FOUND(HttpStatus.NOT_FOUND, "900-2", "지원서가 존재하지 않습니다."),
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
