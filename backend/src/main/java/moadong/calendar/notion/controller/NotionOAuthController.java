package moadong.calendar.notion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.calendar.notion.payload.request.NotionTokenExchangeRequest;
import moadong.calendar.notion.payload.response.NotionTokenExchangeResponse;
import moadong.calendar.notion.service.NotionOAuthService;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/integration/notion")
@RequiredArgsConstructor
@Tag(name = "Notion Integration", description = "Notion OAuth 연동 API")
public class NotionOAuthController {

    private final NotionOAuthService notionOAuthService;

    @GetMapping("/oauth/authorize")
    @Operation(summary = "Notion OAuth 인가 URL 생성", description = "Notion OAuth 인가 페이지로 이동할 URL을 생성합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getAuthorizeUrl(@RequestParam(required = false) String state) {
        try {
            return Response.ok(notionOAuthService.getAuthorizeUrl(state));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new Response<>("BAD_REQUEST", e.getMessage(), null));
        }
    }

    @PostMapping("/oauth/token")
    @Operation(summary = "Notion OAuth code 교환", description = "Notion authorization code를 access token으로 교환합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> exchangeToken(@CurrentUser CustomUserDetails user,
                                           @RequestBody @Valid NotionTokenExchangeRequest request) {
        try {
            NotionTokenExchangeResponse response = notionOAuthService.exchangeCode(user, request);
            return Response.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new Response<>("BAD_REQUEST", e.getMessage(), null));
        }
    }

    @GetMapping("/pages")
    @Operation(summary = "Notion 페이지 조회", description = "Notion 최근 페이지 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getRecentPages(@CurrentUser CustomUserDetails user) {
        try {
            return Response.ok(notionOAuthService.getRecentPages(user));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new Response<>("BAD_REQUEST", e.getMessage(), null));
        }
    }
}
