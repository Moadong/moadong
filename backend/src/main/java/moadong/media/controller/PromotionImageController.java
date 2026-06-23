package moadong.media.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.media.dto.PromotionImageUploadResponse;
import moadong.media.service.PromotionImageUploadService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/promotion")
@RequiredArgsConstructor
@Tag(name = "PromotionImage", description = "홍보 게시판 이미지 업로드 API")
public class PromotionImageController {

    private final PromotionImageUploadService promotionImageUploadService;

    @PostMapping(value = "/{articleId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "홍보 이미지 업로드", description = "홍보 게시글 이미지를 공용 R2 버킷의 promotion 경로에 업로드하고 최종 URL을 반환합니다.")
    public ResponseEntity<?> uploadPromotionImage(@PathVariable String articleId,
                                                  @RequestPart("file") MultipartFile file) {
        PromotionImageUploadResponse response = promotionImageUploadService.upload(articleId, file);
        return Response.ok("홍보 이미지가 업로드되었습니다.", response);
    }
}
