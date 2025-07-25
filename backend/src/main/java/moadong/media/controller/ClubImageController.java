package moadong.media.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import moadong.global.payload.Response;
import moadong.media.dto.FeedUpdateRequest;
import moadong.media.service.ClubImageService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/{clubId}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "로고 이미지 업데이트", description = "cloudflare 상에 로고 이미지를 업데이트합니다.")
    public ResponseEntity<?> uploadLogo(@PathVariable String clubId,
                                        @RequestPart("logo") MultipartFile file) {
        String fileUrl = clubImageService.uploadLogo(clubId, file);
        return Response.ok(fileUrl);
    }

    @DeleteMapping(value = "/{clubId}/logo")
    @Operation(summary = "로고 이미지 삭제", description = "cloudflare 상에 로고 이미지를 저장소에서 삭제합니다.")
    public ResponseEntity<?> deleteLogo(@PathVariable String clubId) {
        clubImageService.deleteLogo(clubId);
        return Response.ok("success delete logo");
    }

    @PostMapping(value = "/{clubId}/feed", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "피드 이미지 업로드", description = "cloudflare 상에 피드에 사용할 이미지를 업로드하고 주소를 반환받습니다.")
    public ResponseEntity<?> uploadFeed(@PathVariable String clubId, @RequestPart("feed") MultipartFile file) {
        return Response.ok(clubImageService.uploadFeed(clubId, file));
    }

    @PostMapping(value = "/{clubId}/feeds")
    @Operation(summary = "저장된 피드 이미지 업데이트(순서, 삭제 등..)", description = "cloudflare 상에 피드 이미지의 설정을 업데이트 합니다.")
    public ResponseEntity<?> putFeeds(@PathVariable String clubId, @RequestBody FeedUpdateRequest feeds) {
        clubImageService.updateFeeds(clubId, feeds.feeds());
        return Response.ok("success put feeds");
    }

    @PostMapping(value = "/{clubId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "커버 이미지 업데이트", description = "cloudflare 상에 커버 이미지를 업데이트합니다.")
    public ResponseEntity<?> uploadCover(@PathVariable String clubId,
                                         @RequestPart("cover") MultipartFile file) {
        String fileUrl = clubImageService.uploadCover(clubId, file);
        return Response.ok(fileUrl);
    }

    @DeleteMapping(value = "/{clubId}/cover")
    @Operation(summary = "커버 이미지 삭제", description = "cloudflare 상에 커버 이미지를 저장소에서 삭제합니다.")
    public ResponseEntity<?> deleteCover(@PathVariable String clubId) {
        clubImageService.deleteCover(clubId);
        return Response.ok("success delete cover");
    }
}
