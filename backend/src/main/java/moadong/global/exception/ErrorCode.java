package moadong.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    CONCURRENCY_CONFLICT(HttpStatus.CONFLICT, "100-1","다른 사용자가 먼저 수정했습니다. 페이지를 새로고침 후 다시 이용해주세요"),

    // 600xx: Club 관련 오류
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

    // 601xx: 파일/미디어 관련 오류
    IMAGE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-1", "이미지 업로드에 실패하였습니다."),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "601-2", "이미지 파일을 찾을 수 없습니다."),
    TOO_MANY_FILES(HttpStatus.PAYLOAD_TOO_LARGE, "601-3", "이미지 파일이 최대치보다 많습니다."),
    IMAGE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-4", "이미지 삭제에 실패하였습니다"),
    KOREAN_FILE_NAME(HttpStatus.INTERNAL_SERVER_ERROR, "601-5", "파일명의 한국어를 인코딩할 수 없습니다."),
    FILE_TRANSFER_ERROR(HttpStatus.BAD_REQUEST, "601-6", "파일을 올바른 형식으로 변경할 수 없습니다."),
    UNSUPPORTED_FILE_TYPE(HttpStatus.BAD_REQUEST, "601-7", "파일의 확장자가 올바르지 않습니다."),
    INVALID_FILE_URL(HttpStatus.BAD_REQUEST, "601-8", "올바르지 않은 파일 URL입니다."),
    FILE_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "601-9", "파일 삭제에 실패하였습니다."),
    FILE_TOO_LARGE(HttpStatus.PAYLOAD_TOO_LARGE, "601-10", "파일 용량이 제한을 초과했습니다."),

    // 700xx: 사용자/권한 관련 오류
    USER_ALREADY_EXIST(HttpStatus.BAD_REQUEST, "700-1", "이미 존재하는 계정입니다."),
    USER_NOT_EXIST(HttpStatus.BAD_REQUEST, "700-2", "존재하지 않는 계정입니다."),
    USER_INVALID_FORMAT(HttpStatus.BAD_REQUEST, "700-3", "올바르지 않은 유저 형식입니다."),
    USER_INVALID_LOGIN(HttpStatus.BAD_REQUEST, "700-4", "올바르지 않은 로그인"),
    USER_UNAUTHORIZED(HttpStatus.FORBIDDEN, "700-5", "권한이 없습니다."),

    // 701xx: 토큰 관련 오류
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "701-1", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "701-2", "토큰이 만료되었습니다."),

    // 702xx: 비밀번호 정책
    PASSWORD_SAME_AS_USERID(HttpStatus.BAD_REQUEST, "702-1", "아이디와 동일한 비밀번호는 설정할 수 없습니다."),
    PASSWORD_SAME_AS_OLD(HttpStatus.BAD_REQUEST,"702-2","이전 비밀번호와 동일한 비밀번호는 설정할 수 없습니다."),

    // 800xx: 지원서/문항 관련
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "800-1", "지원서 양식이 존재하지 않습니다."),
    SHORT_EXCEED_LENGTH(HttpStatus.BAD_REQUEST, "800-2", "단답형 최대 글자를 초과하였습니다."),
    LONG_EXCEED_LENGTH(HttpStatus.BAD_REQUEST, "800-3", "장문형 최대 글자를 초과하였습니다."),
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "800-4", "존재하지 않은 질문입니다."),
    REQUIRED_QUESTION_MISSING(HttpStatus.BAD_REQUEST, "800-5", "필수 응답 질문이 누락되었습니다."),
    ACTIVE_APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "800-6", "활성화된 지원서 양식이 존재하지 않습니다."),
    APPLICATION_SEMESTER_INVALID(HttpStatus.BAD_REQUEST, "800-7", "올바르지 않은 학기입니다."),
    APPLICATION_OPTIONS_MISSING(HttpStatus.BAD_REQUEST, "800-8", "지원서 생성에 필요한 필드가 누락되었습니다."),
    NOT_ALLOWED_EXTERNAL_URL(HttpStatus.BAD_REQUEST, "800-9", "형식에 맞지않은 외부지원서 URL 입니다."),

    // 900xx: 기타 시스템 오류
    AES_CIPHER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "900-1", "암호화 중 오류가 발생했습니다."),
    APPLICANT_NOT_FOUND(HttpStatus.NOT_FOUND, "900-2", "지원서가 존재하지 않습니다."),
    
    // 901xx: FCM 관련 오류
    FCMTOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "901-1", "존재하지 않는 토큰입니다."),
    FCMTOKEN_SUBSCRIBE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "901-2", "동아리 구독중에 오류가 발생 하였습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}
