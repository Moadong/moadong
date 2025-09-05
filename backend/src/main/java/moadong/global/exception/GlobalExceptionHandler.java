package moadong.global.exception;

import lombok.extern.slf4j.Slf4j;
import moadong.global.payload.Response;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Response> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String field = ex.getBindingResult().getFieldErrors().get(0).getField();
        String message = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        String finalErrorMessage = field + " : " + message;

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new Response("BAD_REQUEST", finalErrorMessage, null));
    }

    @ExceptionHandler({OptimisticLockingFailureException.class, UncategorizedMongoDbException.class})
    public ResponseEntity<Response> handleConcurrencyConflict(Exception ex) {
        log.warn("데이터베이스 충돌 발생: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new Response(ErrorCode.CONCURRENCY_CONFLICT.getCode(), ErrorCode.CONCURRENCY_CONFLICT.getMessage(), null));
    }

    @ExceptionHandler(RestApiException.class)
    protected ResponseEntity<Response> handleCustomException(RestApiException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        return handleExceptionInternal(errorCode);
    }

    private ResponseEntity<Response> handleExceptionInternal(ErrorCode errorCode) {
        return ResponseEntity
            .status(errorCode.getHttpStatus())
            .body(new Response(errorCode.getCode(), errorCode.getMessage(), null));
    }
}

