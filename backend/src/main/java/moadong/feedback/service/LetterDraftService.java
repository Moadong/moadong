package moadong.feedback.service;

import lombok.RequiredArgsConstructor;
import moadong.feedback.entity.LetterDraft;
import moadong.feedback.payload.request.LetterDraftRequest;
import moadong.feedback.payload.response.LetterDraftListResponse;
import moadong.feedback.payload.response.LetterDraftResponse;
import moadong.feedback.repository.LetterDraftRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LetterDraftService {

    private final LetterDraftRepository letterDraftRepository;

    public LetterDraftResponse createDraft(LetterDraftRequest request) {
        LetterDraft draft = letterDraftRepository.save(LetterDraft.builder()
                .category(request.category())
                .title(request.title())
                .body(request.body())
                .sendPush(request.sendPush())
                .build());

        return LetterDraftResponse.from(draft);
    }

    public LetterDraftListResponse getDrafts() {
        return new LetterDraftListResponse(
                letterDraftRepository.findAllByOrderByUpdatedAtDesc().stream()
                        .map(LetterDraftResponse::from)
                        .toList());
    }

    public LetterDraftResponse updateDraft(String draftId, LetterDraftRequest request) {
        LetterDraft draft = letterDraftRepository.findById(draftId)
                .orElseThrow(() -> new RestApiException(ErrorCode.LETTER_DRAFT_NOT_FOUND));

        draft.update(request.category(), request.title(), request.body(), request.sendPush());
        return LetterDraftResponse.from(letterDraftRepository.save(draft));
    }

    public void deleteDraft(String draftId) {
        if (!letterDraftRepository.existsById(draftId)) {
            throw new RestApiException(ErrorCode.LETTER_DRAFT_NOT_FOUND);
        }
        letterDraftRepository.deleteById(draftId);
    }
}
