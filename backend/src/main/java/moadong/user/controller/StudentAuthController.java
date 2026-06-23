package moadong.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.global.payload.Response;
import moadong.user.payload.response.StudentIssueResponse;
import moadong.user.service.UserCommandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/student")
@AllArgsConstructor
@Tag(name = "Student Auth", description = "학생 임시 토큰 발급 API")
public class StudentAuthController {

    private final UserCommandService userCommandService;

    @PostMapping
    @Operation(summary = "학생 임시 JWT 발급", description = "랜덤 UUID를 sub로 사용하는 만료 없는 JWT를 발급합니다.")
    public ResponseEntity<?> issueStudentToken() {
        StudentIssueResponse response = userCommandService.issueStudentAccessToken();
        return Response.ok(response);
    }
}
