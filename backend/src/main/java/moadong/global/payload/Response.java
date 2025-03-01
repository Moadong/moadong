package moadong.global.payload;

import org.springframework.http.ResponseEntity;

public record Response<T>(
    String statuscode,
    String message,
    T data
) {

    private static final String OK_CODE = "200";
    private static final String OK_MESSAGE = "ok";

    public static <T> ResponseEntity<Response<T>> ok(T data) {
        return ResponseEntity.ok(new Response<>(OK_CODE, OK_MESSAGE, data));
    }

    public static <T> ResponseEntity<Response<T>> ok(String message, T data) {
        return ResponseEntity.ok(new Response<>(OK_CODE, message, data));
    }

}
