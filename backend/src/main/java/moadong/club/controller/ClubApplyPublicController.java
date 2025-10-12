package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.ClubApplyRequest;
import moadong.club.service.ClubApplyPublicService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/club/{clubId}")
@AllArgsConstructor
@Tag(name = "Club_Apply_Public", description = "클럽 지원서 사용자 API")
public class ClubApplyPublicController {

    private final ClubApplyPublicService clubApplyPublicService;

    @GetMapping("/apply/{applicationFormId}")
    @Operation(summary = "클럽 지원서 양식 불러오기", description = "클럽 지원서 양식을 불러옵니다")
    public ResponseEntity<?> getClubApplication(@PathVariable String clubId,
                                                @PathVariable String applicationFormId) {
        return clubApplyPublicService.getClubApplicationForm(clubId, applicationFormId);
    }

    @PostMapping("/apply/{applicationFormId}")
    @Operation(summary = "클럽 지원", description = "클럽에 지원합니다")
    public ResponseEntity<?> applyToClub(@PathVariable String clubId,
                                         @PathVariable String applicationFormId,
                                         @RequestBody @Validated ClubApplyRequest request) {
        clubApplyPublicService.applyToClub(clubId, applicationFormId, request);
        return Response.ok("success apply");
    }

     /*@GetMapping("/apply")
    @Operation(summary = "클럽의 활성화된 지원서 목록 불러오기", description = "클럽의 활성화된 모든 지원서 목록을 불러옵니다")
    public ResponseEntity<?> getActiveApplicationForms(@PathVariable String clubId) {
        return Response.ok(clubApplyService.getActiveApplicationForms(clubId));
    }*/



}
