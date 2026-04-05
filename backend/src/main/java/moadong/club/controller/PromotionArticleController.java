package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.club.payload.dto.PromotionArticleCreateResultDto;
import moadong.club.payload.request.PromotionArticleCreateRequest;
import moadong.club.payload.request.PromotionArticleUpdateRequest;
import moadong.club.payload.response.PromotionArticleResponse;
import moadong.club.service.PromotionArticleService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> createPromotionArticle(
        @RequestBody @Validated PromotionArticleCreateRequest request) {
        PromotionArticleCreateResultDto response = promotionArticleService.createPromotionArticle(request);
        return Response.ok("홍보 게시글이 생성되었습니다.", response);
    }

    @PutMapping("/{articleId}")
    @Operation(summary = "홍보 게시글 수정", description = "기존 홍보 게시글을 수정합니다.")
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updatePromotionArticle(
        @PathVariable String articleId,
        @RequestBody @Validated PromotionArticleUpdateRequest request) {
        promotionArticleService.updatePromotionArticle(articleId, request);
        return Response.ok("홍보 게시글이 수정되었습니다.");
    }

    @DeleteMapping("/{articleId}")
    @Operation(summary = "홍보 게시글 삭제", description = "기존 홍보 게시글을 삭제합니다.")
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deletePromotionArticle(@PathVariable String articleId) {
        promotionArticleService.deletePromotionArticle(articleId);
        return Response.ok("홍보 게시글이 삭제되었습니다.", null);
    }
}
