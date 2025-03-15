package moadong.gcs.controller;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import moadong.gcs.dto.FeedDeleteRequest;
import moadong.gcs.service.ClubImageService;
import moadong.global.payload.Response;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
@Tag(name = "ClubImage", description = "클럽 이미지 관련 API")
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

    @PutMapping(value = "/{clubId}/feeds", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "피드 이미지 업로드", description = "피드 이미지를 저장소에 새로 업로드합니다.")
    public ResponseEntity<?> putFeeds(@PathVariable String clubId,
                                      @RequestPart("feeds") List<MultipartFile> files) {
        clubImageService.putFeeds(clubId, files);
        return Response.ok("success put feeds");
    }

    @PostMapping(value = "/{clubId}/feeds", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "피드 이미지 업로드", description = "피드 이미지를 저장소에 추가합니다.")
    public ResponseEntity<?> uploadFeeds(@PathVariable String clubId,
                                      @RequestPart("feeds") List<MultipartFile> files) {
        clubImageService.uploadFeeds(clubId, files);
        return Response.ok("success put feeds");
    }

    @DeleteMapping(value = "/{clubId}/feeds")
    @Operation(summary = "동아리 이미지 삭제", description = "저장소에 있는 동아리 이미지를 삭제합니다.")
    public ResponseEntity<?> deleteFeeds(@PathVariable String clubId,
                                         @RequestBody FeedDeleteRequest request) {
        clubImageService.deleteFeeds(clubId, request.feeds());
        return Response.ok("success delete feeds");
    }
}
