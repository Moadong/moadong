package moadong.unit.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import moadong.global.RegexConstants;
import moadong.global.exception.GlobalExceptionHandler;
import moadong.user.controller.StudentAuthController;
import moadong.user.payload.response.StudentIssueResponse;
import moadong.user.service.UserCommandService;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@UnitTest
class StudentAuthControllerTest {

    private static final String STUDENT_ID = "3f2a1b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c";

    private MockMvc mockMvc;

    @Mock
    private UserCommandService userCommandService;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new StudentAuthController(userCommandService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void 본문_없이_요청하면_새_신원으로_발급된다() throws Exception {
        when(userCommandService.issueStudentAccessToken(anyString()))
                .thenReturn(new StudentIssueResponse("token"));

        mockMvc.perform(post("/auth/student"))
                .andExpect(status().isOk());

        assertThat(capturedStudentId()).matches(RegexConstants.UUID_V4);
    }

    @Test
    void 본문에_sub가_없으면_새_신원으로_발급된다() throws Exception {
        when(userCommandService.issueStudentAccessToken(anyString()))
                .thenReturn(new StudentIssueResponse("token"));

        mockMvc.perform(post("/auth/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"iat\":1700000000}"))
                .andExpect(status().isOk());

        assertThat(capturedStudentId()).matches(RegexConstants.UUID_V4);
    }

    @Test
    void 본문의_sub가_studentId로_사용된다() throws Exception {
        when(userCommandService.issueStudentAccessToken(anyString()))
                .thenReturn(new StudentIssueResponse("token"));

        mockMvc.perform(post("/auth/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sub\":\"" + STUDENT_ID + "\",\"iat\":1700000000}"))
                .andExpect(status().isOk());

        assertThat(capturedStudentId()).isEqualTo(STUDENT_ID);
    }

    @Test
    void 대문자_sub는_소문자로_정규화된다() throws Exception {
        when(userCommandService.issueStudentAccessToken(anyString()))
                .thenReturn(new StudentIssueResponse("token"));

        mockMvc.perform(post("/auth/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sub\":\"" + STUDENT_ID.toUpperCase() + "\"}"))
                .andExpect(status().isOk());

        assertThat(capturedStudentId()).isEqualTo(STUDENT_ID);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "moadong-admin",
            "507f1f77bcf86cd799439011",
            "",
            "3f2a1b4c-5d6e-1f7a-8b9c-0d1e2f3a4b5c"
    })
    void UUIDv4가_아닌_sub는_거부된다(String sub) throws Exception {
        mockMvc.perform(post("/auth/student")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sub\":\"" + sub + "\"}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(userCommandService);
    }

    private String capturedStudentId() {
        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(userCommandService).issueStudentAccessToken(captor.capture());
        return captor.getValue();
    }
}
