package moadong.feedback.service;

import moadong.feedback.entity.LetterDraft;
import moadong.feedback.enums.LetterCategory;
import moadong.feedback.payload.request.LetterDraftRequest;
import moadong.feedback.payload.response.LetterDraftResponse;
import moadong.feedback.repository.LetterDraftRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@UnitTest
class LetterDraftServiceTest {

    @Mock
    private LetterDraftRepository letterDraftRepository;

    @InjectMocks
    private LetterDraftService letterDraftService;

    @Test
    void 제목과_본문이_비어있어도_임시저장된다() {
        when(letterDraftRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        LetterDraftResponse response = letterDraftService.createDraft(
                new LetterDraftRequest(null, null, null, false));

        assertNull(response.title());
        assertNull(response.body());
        verify(letterDraftRepository).save(any(LetterDraft.class));
    }

    @Test
    void 이어쓰기는_기존_초안을_덮어쓴다() {
        LetterDraft draft = LetterDraft.builder()
                .id("draft-1")
                .category(LetterCategory.UPDATE)
                .title("쓰다 만 제목")
                .body("쓰다 만 본문")
                .build();
        when(letterDraftRepository.findById("draft-1")).thenReturn(Optional.of(draft));
        when(letterDraftRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        letterDraftService.updateDraft("draft-1",
                new LetterDraftRequest(LetterCategory.STORY, "완성된 제목", "완성된 본문", true));

        ArgumentCaptor<LetterDraft> captor = ArgumentCaptor.forClass(LetterDraft.class);
        verify(letterDraftRepository).save(captor.capture());
        assertEquals(LetterCategory.STORY, captor.getValue().getCategory());
        assertEquals("완성된 제목", captor.getValue().getTitle());
        assertTrue(captor.getValue().isSendPush());
    }

    @Test
    void 없는_초안은_이어쓸_수_없다() {
        when(letterDraftRepository.findById("draft-1")).thenReturn(Optional.empty());

        RestApiException exception = assertThrows(RestApiException.class, () -> letterDraftService.updateDraft(
                "draft-1", new LetterDraftRequest(LetterCategory.UPDATE, "제목", "본문", false)));

        assertEquals(ErrorCode.LETTER_DRAFT_NOT_FOUND, exception.getErrorCode());
        verify(letterDraftRepository, never()).save(any());
    }

    @Test
    void 없는_초안은_삭제할_수_없다() {
        when(letterDraftRepository.existsById("draft-1")).thenReturn(false);

        RestApiException exception = assertThrows(RestApiException.class,
                () -> letterDraftService.deleteDraft("draft-1"));

        assertEquals(ErrorCode.LETTER_DRAFT_NOT_FOUND, exception.getErrorCode());
        verify(letterDraftRepository, never()).deleteById(any());
    }
}
