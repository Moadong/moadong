package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.request.StudentIssueRequest;
import moadong.user.payload.response.StudentIssueResponse;
import moadong.user.service.UserCommandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/student")
@AllArgsConstructor
@Tag(name = "Student Auth", description = "학생 임시 토큰 발급 API")
public class StudentAuthController {

    private final UserCommandService userCommandService;

    @PostMapping
    @Operation(summary = "학생 임시 JWT 발급", description = "만료 없는 JWT를 발급합니다. 본문에 기존 sub(UUIDv4)를 담으면 같은 신원으로 재발급하고, 본문이 없으면 랜덤 UUID로 새 신원을 만듭니다.")
    public ResponseEntity<?> issueStudentToken(
            @Valid @RequestBody(required = false) StudentIssueRequest request) {
        StudentIssueResponse response = userCommandService.issueStudentAccessToken(
                StudentIssueRequest.resolveStudentId(request));
        return Response.ok(response);
    }
}
