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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
        return Response.ok(notionOAuthService.getAuthorizeUrl(state));
    }

    @PostMapping("/oauth/token")
    @Operation(summary = "Notion OAuth code 교환", description = "Notion authorization code를 access token으로 교환합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> exchangeToken(@CurrentUser CustomUserDetails user,
                                           @RequestBody @Valid NotionTokenExchangeRequest request) {
        NotionTokenExchangeResponse response = notionOAuthService.exchangeCode(user, request);
        return Response.ok(response);
    }

    @GetMapping("/pages")
    @Operation(summary = "Notion 페이지 조회", description = "Notion 최근 페이지 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getRecentPages(@CurrentUser CustomUserDetails user) {
        return Response.ok(notionOAuthService.getRecentPages(user));
    }

    @GetMapping("/databases")
    @Operation(summary = "Notion DB 목록 조회", description = "Notion에서 접근 가능한 데이터베이스 목록을 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getDatabases(@CurrentUser CustomUserDetails user) {
        return Response.ok(notionOAuthService.getDatabases(user));
    }

    @GetMapping("/databases/{databaseId}/pages")
    @Operation(summary = "Notion DB 레코드 조회", description = "Notion 데이터베이스 query 결과(페이지 레코드)를 조회합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getDatabasePages(@CurrentUser CustomUserDetails user,
                                              @PathVariable String databaseId,
                                              @RequestParam(required = false) String dateProperty) {
        return Response.ok(notionOAuthService.getDatabasePages(user, databaseId, dateProperty));
    }
}
