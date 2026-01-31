package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.club.payload.request.PromotionArticleCreateRequest;
import moadong.club.payload.response.PromotionArticleResponse;
import moadong.club.service.PromotionArticleService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotion")
@RequiredArgsConstructor
@Tag(name = "Promotion", description = "홍보게시판 API")
public class PromotionArticleController {

    private final PromotionArticleService promotionArticleService;

    @GetMapping
    @Operation(summary = "홍보 게시글 목록 조회", description = "전체 홍보 게시글 목록을 조회합니다.")
    public ResponseEntity<?> getPromotionArticles() {
        PromotionArticleResponse response = promotionArticleService.getPromotionArticles();
        return Response.ok(response);
    }

    @PostMapping
    @Operation(summary = "홍보 게시글 생성", description = "새로운 홍보 게시글을 생성합니다.")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createPromotionArticle(
        @RequestBody @Validated PromotionArticleCreateRequest request) {
        promotionArticleService.createPromotionArticle(request);
        return Response.ok("홍보 게시글이 생성되었습니다.");
    }
}
