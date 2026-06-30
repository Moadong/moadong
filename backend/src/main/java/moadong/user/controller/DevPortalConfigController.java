package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.global.config.properties.DevPortalProperties;
import moadong.global.payload.Response;
import moadong.user.payload.response.DevPortalConfigResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev/config")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "DevPortalConfig", description = "개발자 포털 설정 API")
public class DevPortalConfigController {

    private final DevPortalProperties devPortalProperties;

    @GetMapping
    @Operation(summary = "개발자 포털 설정 조회", description = "개발자 포털에서 사용하는 서버 설정을 조회합니다.")
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getConfig() {
        log.info("Dev portal config requested. kakaoJavascriptKeyPresent={}",
            devPortalProperties.kakaoJavascriptKey() != null && !devPortalProperties.kakaoJavascriptKey().isBlank());
        return Response.ok(new DevPortalConfigResponse(devPortalProperties.kakaoJavascriptKey()));
    }
}
