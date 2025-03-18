package moadong.gcs.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.gcs.domain.FileType;
import moadong.gcs.dto.FeedUpdateRequest;
import moadong.gcs.service.ClubImageService;
import moadong.global.payload.Response;
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
@RequiredArgsConstructor
@Tag(name = "ClubImage", description = "클럽 이미지 관련 API")
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "BearerAuth")
public class ClubImageController {

    private final ClubImageService clubImageService;


    @PostMapping(value = "/{clubId}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "로고 이미지 업로드", description = "로고 이미지를 저장소에 업로드합니다.")
    public ResponseEntity<?> uploadLogo(@PathVariable String clubId,
                                        @RequestPart("logo") MultipartFile file) {
        String fileUrl = clubImageService.uploadLogo(clubId, file);
        return Response.ok(fileUrl);
    }

    @DeleteMapping(value = "/{clubId}/logo")
    @Operation(summary = "로고 이미지 삭제", description = "로고 이미지를 저장소에서 삭제합니다.")
    public ResponseEntity<?> deleteLogo(@PathVariable String clubId) {
        clubImageService.deleteLogo(clubId);
        return Response.ok("success delete logo");
    }

    // TODO : Signed URL 을 통한 업로드로 추후 변경
    @PostMapping(value = "/{clubId}/feed", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "피드 이미지 업로드", description = "피드 이미지를 저장소에 추가합니다.")
    public ResponseEntity<?> uploadFeed(@PathVariable String clubId,
                                        @RequestPart("feed") MultipartFile file) {
        return Response.ok(clubImageService.uploadFile(clubId, file, FileType.FEED));
    }

    @PostMapping(value = "/{clubId}/feeds")
    @Operation(summary = "피드 정보 갱신", description = "피드 이미지를 저장소(gcs)에 새로 업로드합니다.")
    public ResponseEntity<?> putFeeds(@PathVariable String clubId,
                                      @RequestBody FeedUpdateRequest feeds) {
        clubImageService.updateFeeds(clubId, feeds.feeds());
        return Response.ok("success put feeds");
    }

}
