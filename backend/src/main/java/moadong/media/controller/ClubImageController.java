package moadong.media.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import moadong.global.payload.Response;
import moadong.media.dto.FeedUpdateRequest;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadCompleteRequest;
import moadong.media.dto.UploadUrlRequest;
import moadong.media.service.ClubImageService;
import moadong.user.annotation.CurrentUser;
import moadong.user.payload.CustomUserDetails;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/club")
@Tag(name = "ClubImage", description = "클럽 이미지 관련 API")
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "BearerAuth")
public class ClubImageController {

    public ClubImageController(@Qualifier("cloudflare") ClubImageService clubImageService) {
        this.clubImageService = clubImageService;
    }

    private final ClubImageService clubImageService;

    @DeleteMapping(value = "/{clubId}/logo")
    @Operation(summary = "로고 이미지 삭제", description = "로고 이미지를 저장소에서 삭제합니다.")
    public ResponseEntity<?> deleteLogo(@PathVariable String clubId, @CurrentUser CustomUserDetails user) {
        clubImageService.deleteLogo(clubId, user.getId());
        return Response.ok("success delete logo");
    }

    @PostMapping(value = "/{clubId}/feeds")
    @Operation(summary = "저장된 피드 이미지 업데이트(순서, 삭제 등..)", description = "피드 이미지의 설정을 업데이트 합니다.")
    public ResponseEntity<?> putFeeds(@PathVariable String clubId, @RequestBody @Valid FeedUpdateRequest feeds, @CurrentUser CustomUserDetails user) {
        clubImageService.updateFeeds(clubId, user.getId(), feeds.feeds());
        return Response.ok("success put feeds");
    }

    @DeleteMapping(value = "/{clubId}/cover")
    @Operation(summary = "커버 이미지 삭제", description = "커버 이미지를 저장소에서 삭제합니다.")
    public ResponseEntity<?> deleteCover(@PathVariable String clubId, @CurrentUser CustomUserDetails user) {
        clubImageService.deleteCover(clubId, user.getId());
        return Response.ok("success delete cover");
    }

    @PostMapping("/{clubId}/logo/upload-url")
    @Operation(summary = "로고 이미지 업로드 URL 생성", description = "로고 이미지 업로드를 위한 Presigned URL을 생성합니다.")
    public ResponseEntity<?> generateLogoUploadUrl(@PathVariable String clubId,
                                                   @RequestBody @Valid UploadUrlRequest request,
                                                   @CurrentUser CustomUserDetails user) {
        PresignedUploadResponse response = clubImageService.generateLogoUploadUrl(
                clubId, user.getId(), request.fileName(), request.contentType());
        return Response.ok(response);
    }

    @PostMapping("/{clubId}/logo/complete")
    @Operation(summary = "로고 이미지 업로드 완료", description = "클라이언트가 Presigned URL로 업로드한 후 호출하는 완료 API입니다.")
    public ResponseEntity<?> completeLogoUpload(@PathVariable String clubId,
                                                @RequestBody @Valid UploadCompleteRequest request,
                                                @CurrentUser CustomUserDetails user) {
        clubImageService.completeLogoUpload(clubId, user.getId(), request.fileUrl());
        return Response.ok("success upload logo");
    }

    @PostMapping("/{clubId}/feed/upload-url")
    @Operation(summary = "피드 이미지 업로드 URL들 생성", description = "피드 이미지 업로드를 위한 Presigned URL을 여러 개 한 번에 생성합니다.")
    public ResponseEntity<?> generateFeedUploadUrl(@PathVariable String clubId,
                                                   @RequestBody @Valid List<UploadUrlRequest> requests,
                                                   @CurrentUser CustomUserDetails user) {
        List<PresignedUploadResponse> results = clubImageService.generateFeedUploadUrls(clubId, user.getId(), requests);
        return Response.ok(results);
    }

    // feed complete API는 더 이상 사용하지 않습니다. (검증은 updateFeeds에서 수행)

    @PostMapping("/{clubId}/cover/upload-url")
    @Operation(summary = "커버 이미지 업로드 URL 생성", description = "커버 이미지 업로드를 위한 Presigned URL을 생성합니다.")
    public ResponseEntity<?> generateCoverUploadUrl(@PathVariable String clubId,
                                                    @RequestBody @Valid UploadUrlRequest request,
                                                    @CurrentUser CustomUserDetails user) {
        PresignedUploadResponse response = clubImageService.generateCoverUploadUrl(
                clubId, user.getId(), request.fileName(), request.contentType());
        return Response.ok(response);
    }

    @PostMapping("/{clubId}/cover/complete")
    @Operation(summary = "커버 이미지 업로드 완료", description = "클라이언트가 Presigned URL로 업로드한 후 호출하는 완료 API입니다.")
    public ResponseEntity<?> completeCoverUpload(@PathVariable String clubId,
                                                 @RequestBody @Valid UploadCompleteRequest request,
                                                 @CurrentUser CustomUserDetails user) {
        clubImageService.completeCoverUpload(clubId, user.getId(), request.fileUrl());
        return Response.ok("success upload cover");
    }
}
