package moadong.media.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.global.payload.Response;
import moadong.media.dto.BannerImagesRequest;
import moadong.media.dto.BannerImagesResponse;
import moadong.media.service.BannerImagesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/banner")
@RequiredArgsConstructor
@Tag(name = "Banner", description = "배너 이미지 조회/관리 API")
public class BannerImagesController {

    private final BannerImagesService bannerImagesService;

    @PutMapping
    @PreAuthorize("hasRole('DEVELOPER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "배너 이미지 목록 저장", description = "배너 이미지 URL 배열 전체를 저장합니다. 배열 인덱스가 노출 순서를 의미합니다.")
    public ResponseEntity<?> putBannerImages(@RequestBody @Validated BannerImagesRequest request) {
        bannerImagesService.putBannerImages(request.images());
        return Response.ok("배너 이미지가 저장되었습니다.");
    }

    @GetMapping
    @Operation(summary = "배너 이미지 목록 조회", description = "저장된 배너 이미지 URL 배열을 반환합니다.")
    public ResponseEntity<?> getBannerImages() {
        BannerImagesResponse response = bannerImagesService.getBannerImages();
        return Response.ok(response);
    }
}
