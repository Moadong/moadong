package moadong.media.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.PromotionImageUploadResponse;
import moadong.media.dto.UploadUrlRequest;
import moadong.media.service.PromotionImageUploadService;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/promotion")
@RequiredArgsConstructor
@Tag(name = "PromotionImage", description = "홍보 게시판 이미지 업로드 API")
public class PromotionImageController {

    private final PromotionImageUploadService promotionImageUploadService;

    @PostMapping(value = "/{articleId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('DEVELOPER', 'CLUB_ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "홍보 이미지 업로드", description = "홍보 게시글 이미지를 공용 R2 버킷의 promotion 경로에 업로드하고 최종 URL을 반환합니다. 동아리 관리자는 본인 동아리 게시글에만 업로드할 수 있습니다.")
    public ResponseEntity<?> uploadPromotionImage(@CurrentUser CustomUserDetails user,
                                                  @PathVariable String articleId,
                                                  @RequestPart("file") MultipartFile file) {
        PromotionImageUploadResponse response = promotionImageUploadService.upload(articleId, file, user);
        return Response.ok("홍보 이미지가 업로드되었습니다.", response);
    }

    @PostMapping("/upload-url")
    @PreAuthorize("hasAnyRole('DEVELOPER', 'CLUB_ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "홍보 이미지 업로드 URL 생성", description = "홍보 게시글 이미지 업로드를 위한 Presigned URL을 여러 개 한 번에 생성합니다. 키가 동아리 기준이라 게시글을 만들기 전에도 발급받을 수 있고, 업로드한 finalUrl은 생성·수정 요청의 images로 그대로 전달하면 됩니다. clubId는 개발자만 쓰며, 동아리 관리자는 보내더라도 본인 동아리로 강제됩니다.")
    public ResponseEntity<?> generatePromotionImageUploadUrls(@CurrentUser CustomUserDetails user,
                                                             @RequestParam(value = "clubId", required = false) String clubId,
                                                             @RequestBody @Valid List<UploadUrlRequest> requests) {
        List<PresignedUploadResponse> responses = promotionImageUploadService.createUploadUrls(clubId, requests, user);
        return Response.ok("홍보 이미지 업로드 URL이 생성되었습니다.", responses);
    }
}
