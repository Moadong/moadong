package moadong.feedback.service;

import moadong.feedback.entity.Feedback;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.FeedbackStatus;
import moadong.feedback.enums.FeedbackType;
import moadong.feedback.enums.LetterCategory;
import moadong.feedback.enums.SentFeedbackStatus;
import moadong.feedback.payload.request.FeedbackCreateRequest;
import moadong.feedback.payload.response.ReceivedLetterDetailResponse;
import moadong.feedback.payload.response.ReceivedLetterListResponse;
import moadong.feedback.repository.FeedbackRepository;
import moadong.feedback.repository.LetterRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class FeedbackServiceTest {

    private static final String STUDENT_ID = "11111111-1111-1111-1111-111111111111";
    private static final String OTHER_STUDENT_ID = "22222222-2222-2222-2222-222222222222";

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private LetterRepository letterRepository;

    @Mock
    private FeedbackImageService feedbackImageService;

    @InjectMocks
    private FeedbackService feedbackService;

    @Test
    void 피드백_저장_시_사진은_검증을_거친_결과가_들어간다() {
        List<String> requested = List.of("https://cdn.moadong.com/feedback/" + STUDENT_ID + "/a.jpg");
        when(feedbackImageService.validateImages(STUDENT_ID, requested)).thenReturn(requested);
        when(feedbackRepository.save(any(Feedback.class))).thenAnswer(invocation -> invocation.getArgument(0));

        feedbackService.createFeedback(STUDENT_ID,
                new FeedbackCreateRequest(FeedbackType.BUG, "사진과 함께 버그를 신고합니다", requested));

        ArgumentCaptor<Feedback> captor = ArgumentCaptor.forClass(Feedback.class);
        verify(feedbackRepository).save(captor.capture());
        assertEquals(requested, captor.getValue().getImages());
    }

    @Test
    void 사진_검증에_실패하면_피드백이_저장되지_않는다() {
        List<String> requested = List.of("https://evil.example.com/a.jpg");
        when(feedbackImageService.validateImages(STUDENT_ID, requested))
                .thenThrow(new RestApiException(ErrorCode.INVALID_FILE_URL));

        assertThrows(RestApiException.class, () -> feedbackService.createFeedback(STUDENT_ID,
                new FeedbackCreateRequest(FeedbackType.BUG, "사진과 함께 버그를 신고합니다", requested)));

        verify(feedbackRepository, never()).save(any(Feedback.class));
    }

    @Test
    void 받은_편지_목록은_학생별로_읽음_여부를_계산한다() {
        Letter read = Letter.builder()
                .id("letter-read")
                .category(LetterCategory.UPDATE)
                .title("업데이트")
                .body("본문")
                .readStudentIds(Set.of(STUDENT_ID))
                .build();
        Letter unread = Letter.builder()
                .id("letter-unread")
                .category(LetterCategory.STORY)
                .title("이야기")
                .body("본문")
                .readStudentIds(Set.of(OTHER_STUDENT_ID))
                .build();
        when(letterRepository.findInboxByStudentId(STUDENT_ID)).thenReturn(List.of(read, unread));

        ReceivedLetterListResponse response = feedbackService.getReceivedLetters(STUDENT_ID, null);

        assertTrue(response.letters().get(0).isRead());
        assertFalse(response.letters().get(1).isRead());
    }

    @Test
    void 목록_요약은_본문을_잘라서_내려준다() {
        String longBody = "가".repeat(100);
        Letter letter = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.STORY)
                .title("이야기")
                .body(longBody)
                .readStudentIds(Set.of())
                .build();
        when(letterRepository.findInboxByStudentId(STUDENT_ID)).thenReturn(List.of(letter));

        ReceivedLetterListResponse response = feedbackService.getReceivedLetters(STUDENT_ID, null);

        assertEquals("가".repeat(60) + "...", response.letters().get(0).preview());
    }

    @Test
    void 답장_편지_상세는_원본_피드백을_동봉한다() {
        Letter reply = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .recipientStudentId(STUDENT_ID)
                .feedbackId("feedback-1")
                .title("답장")
                .body("본문")
                .build();
        Feedback original = Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.FEATURE)
                .content("즐겨찾기 알림이 있으면 좋겠어요")
                .status(FeedbackStatus.REPLIED)
                .build();
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(reply));
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(original));

        ReceivedLetterDetailResponse response = feedbackService.getReceivedLetter(STUDENT_ID, "letter-1");

        assertEquals("feedback-1", response.myFeedback().id());
        assertEquals(SentFeedbackStatus.REPLIED, response.myFeedback().status());
    }

    @Test
    void 전체_발행_편지_상세는_myFeedback_없이_내려간다() {
        Letter broadcast = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.UPDATE)
                .title("업데이트")
                .body("본문")
                .build();
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(broadcast));

        ReceivedLetterDetailResponse response = feedbackService.getReceivedLetter(STUDENT_ID, "letter-1");

        assertNull(response.myFeedback());
    }

    @Test
    void 남의_답장_편지는_조회할_수_없다() {
        Letter reply = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .recipientStudentId(OTHER_STUDENT_ID)
                .feedbackId("feedback-1")
                .title("답장")
                .body("본문")
                .build();
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(reply));

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackService.getReceivedLetter(STUDENT_ID, "letter-1"));

        assertEquals(ErrorCode.LETTER_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 남의_피드백_상세는_조회할_수_없다() {
        Feedback feedback = Feedback.builder()
                .id("feedback-1")
                .studentId(OTHER_STUDENT_ID)
                .type(FeedbackType.BUG)
                .content("버그가 있어요")
                .build();
        when(feedbackRepository.findById("feedback-1")).thenReturn(Optional.of(feedback));

        RestApiException exception = assertThrows(RestApiException.class,
                () -> feedbackService.getSentFeedback(STUDENT_ID, "feedback-1"));

        assertEquals(ErrorCode.FEEDBACK_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void 읽을_수_없는_편지는_읽음_처리되지_않는다() {
        Letter reply = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.REPLY)
                .recipientStudentId(OTHER_STUDENT_ID)
                .title("답장")
                .body("본문")
                .build();
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(reply));

        assertThrows(RestApiException.class, () -> feedbackService.markLetterRead(STUDENT_ID, "letter-1"));

        verify(letterRepository, never()).markRead("letter-1", STUDENT_ID);
    }

    @Test
    void 읽음_처리는_학생을_읽은_목록에_추가한다() {
        Letter broadcast = Letter.builder()
                .id("letter-1")
                .category(LetterCategory.UPDATE)
                .title("업데이트")
                .body("본문")
                .build();
        when(letterRepository.findById("letter-1")).thenReturn(Optional.of(broadcast));

        feedbackService.markLetterRead(STUDENT_ID, "letter-1");

        verify(letterRepository).markRead("letter-1", STUDENT_ID);
    }

    @Test
    void 답장_전_피드백은_사용자에게_PENDING으로_보인다() {
        Feedback feedback = Feedback.builder()
                .id("feedback-1")
                .studentId(STUDENT_ID)
                .type(FeedbackType.QUESTION)
                .content("궁금한 게 있어요")
                .status(FeedbackStatus.IN_PROGRESS)
                .build();
        when(feedbackRepository.findByStudentIdOrderByCreatedAtDesc(STUDENT_ID)).thenReturn(List.of(feedback));

        assertEquals(SentFeedbackStatus.PENDING,
                feedbackService.getSentFeedbacks(STUDENT_ID).feedbacks().get(0).status());
    }
}
