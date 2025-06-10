package moadong.global.exception;

import moadong.global.payload.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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

