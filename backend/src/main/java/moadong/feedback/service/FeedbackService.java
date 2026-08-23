package moadong.feedback.service;

import lombok.RequiredArgsConstructor;
import moadong.feedback.entity.Feedback;
import moadong.feedback.entity.Letter;
import moadong.feedback.enums.LetterCategory;
import moadong.feedback.payload.request.FeedbackCreateRequest;
import moadong.feedback.payload.response.FeedbackCreateResponse;
import moadong.feedback.payload.response.ReceivedLetterDetailResponse;
import moadong.feedback.payload.response.ReceivedLetterListResponse;
import moadong.feedback.payload.response.ReceivedLetterSummaryResponse;
import moadong.feedback.payload.response.SentFeedbackListResponse;
import moadong.feedback.payload.response.SentFeedbackResponse;
import moadong.feedback.repository.FeedbackRepository;
import moadong.feedback.repository.LetterRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final LetterRepository letterRepository;
    private final FeedbackImageService feedbackImageService;

    public FeedbackCreateResponse createFeedback(String studentId, FeedbackCreateRequest request) {
        Feedback feedback = feedbackRepository.save(Feedback.builder()
                .studentId(studentId)
                .type(request.type())
                .content(request.content())
                .images(feedbackImageService.validateImages(studentId, request.images()))
                .build());

        return new FeedbackCreateResponse(feedback.getId());
    }

    public ReceivedLetterListResponse getReceivedLetters(String studentId, LetterCategory category) {
        List<Letter> letters = category == null
                ? letterRepository.findInboxByStudentId(studentId)
                : letterRepository.findInboxByStudentIdAndCategory(studentId, category);

        return new ReceivedLetterListResponse(letters.stream()
                .map(letter -> ReceivedLetterSummaryResponse.from(letter, studentId))
                .toList());
    }

    public ReceivedLetterDetailResponse getReceivedLetter(String studentId, String letterId) {
        Letter letter = getReadableLetter(studentId, letterId);
        return ReceivedLetterDetailResponse.of(letter, findOriginalFeedback(letter));
    }

    public SentFeedbackListResponse getSentFeedbacks(String studentId) {
        return new SentFeedbackListResponse(
                feedbackRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                        .map(SentFeedbackResponse::from)
                        .toList());
    }

    public SentFeedbackResponse getSentFeedback(String studentId, String feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .filter(it -> it.getStudentId().equals(studentId))
                .orElseThrow(() -> new RestApiException(ErrorCode.FEEDBACK_NOT_FOUND));

        return SentFeedbackResponse.from(feedback);
    }

    public void markLetterRead(String studentId, String letterId) {
        getReadableLetter(studentId, letterId);
        letterRepository.markRead(letterId, studentId);
    }

    /**
     * 전체 발행 편지는 누구나, REPLY 편지는 수신자만 읽을 수 있다.
     * 남의 편지인지 없는 편지인지 구분되지 않도록 같은 에러로 응답한다.
     */
    private Letter getReadableLetter(String studentId, String letterId) {
        return letterRepository.findById(letterId)
                .filter(letter -> letter.isReadableBy(studentId))
                .orElseThrow(() -> new RestApiException(ErrorCode.LETTER_NOT_FOUND));
    }

    private SentFeedbackResponse findOriginalFeedback(Letter letter) {
        if (letter.getCategory() != LetterCategory.REPLY || letter.getFeedbackId() == null) {
            return null;
        }

        return feedbackRepository.findById(letter.getFeedbackId())
                .map(SentFeedbackResponse::from)
                .orElse(null);
    }
}
