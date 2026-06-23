package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.request.DevRegisterRequest;
import moadong.user.service.UserCommandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/dev")
@AllArgsConstructor
@Tag(name = "Dev Auth", description = "개발자 전용 계정 등록 API (시크릿 키 필요)")
public class DevAuthController {

    private final UserCommandService userCommandService;

    @PostMapping("/register")
    @Operation(summary = "개발자 계정 등록", description = "app.dev-registration-secret과 일치하는 secret을 보내야 합니다. 개발자만 /dev, /api/admin/** 접근 가능.")
    public ResponseEntity<?> registerDeveloper(@RequestBody @Valid DevRegisterRequest request) {
        userCommandService.registerDeveloper(request);
        return Response.ok("success register developer");
    }
}
