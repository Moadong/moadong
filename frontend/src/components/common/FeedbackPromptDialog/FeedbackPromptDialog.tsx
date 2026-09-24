import { useMemo, useState } from 'react';
import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';
import { submitFeedbackResponse } from '@/apis/feedbackPrompt';
import {
  clearFeedbackPromptSession,
  beginFeedbackSubmit,
  dismissActiveFeedbackPrompt,
  endFeedbackSubmit,
  FeedbackPromptSession,
} from '@/feedbackPrompt/feedbackPromptController';
import { useFeedbackPrompt } from '@/hooks/useFeedbackPrompt';
import { FeedbackRating } from '@/types/feedbackPrompt';
import { parseFeedbackResponse } from '@/utils/feedbackPromptValidation';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './FeedbackPromptDialog.styles';

const FeedbackPromptDialogContent = ({
  session,
}: {
  session: FeedbackPromptSession;
}) => {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const selected = useMemo(
    () => session?.prompt.ratingOptions.find((option) => option.rating === rating),
    [session, rating],
  );
  const followUp = selected?.requiresFollowUp ? session.prompt.followUp : null;
  const canSubmit = !!rating && (!selected?.requiresFollowUp || !!followUp);
  const selectRating = async (next: FeedbackRating) => {
    if (isSubmitting) return;
    const option = session.prompt.ratingOptions.find((item) => item.rating === next);
    setRating(next); setReasons([]); setComment('');
    if (!option || option.requiresFollowUp) return;
    setIsSubmitting(true);
    beginFeedbackSubmit();
    try {
      const result = await submitFeedbackResponse(session.prompt.id, {
        triggerType: session.triggerType, clubId: session.clubId,
        anonymousClientId: session.identity.anonymousClientId, rating: next,
        reasonOptionIds: [], clientContext: { path: session.sourcePath, deviceType: window.innerWidth <= 500 ? 'mobile' : window.innerWidth <= 900 ? 'tablet' : 'desktop', userAgent: navigator.userAgent, appWebView: isInAppWebView() },
      }, session.identity);
      if (!parseFeedbackResponse(result)) throw new Error('unknown result');
      clearFeedbackPromptSession();
    } catch { setMessage('전송 결과를 확인하지 못했어요. 다시 보내지 않고 닫을 수 있어요.'); }
    finally { setIsSubmitting(false); endFeedbackSubmit(); }
  };
  const submit = async () => {
    if (!canSubmit || !rating || isSubmitting) return;
    setIsSubmitting(true);
    beginFeedbackSubmit();
    try {
      const result = await submitFeedbackResponse(session.prompt.id, {
        triggerType: session.triggerType, clubId: session.clubId, anonymousClientId: session.identity.anonymousClientId,
        rating, reasonOptionIds: reasons, comment: comment || undefined,
        clientContext: { path: session.sourcePath, deviceType: window.innerWidth <= 500 ? 'mobile' : window.innerWidth <= 900 ? 'tablet' : 'desktop', userAgent: navigator.userAgent, appWebView: isInAppWebView() },
      }, session.identity);
      if (!parseFeedbackResponse(result)) throw new Error('unknown result');
      clearFeedbackPromptSession();
    } catch { setMessage('전송 결과를 확인하지 못했어요. 다시 보내지 않고 닫을 수 있어요.'); }
    finally { setIsSubmitting(false); endFeedbackSubmit(); }
  };
  const toggleReason = (id: string) => setReasons((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 8 ? [...current, id] : current);
  const close = () => {
    if (message || isSubmitting) clearFeedbackPromptSession();
    else dismissActiveFeedbackPrompt();
  };
  return <Modal isOpen onClose={close} closeOnBackdrop={false} overlayKind='survey'>
    <Styled.Dialog role='dialog' aria-modal='true' aria-labelledby='feedback-prompt-title'>
      <Styled.CloseButton type='button' onClick={close} aria-label='닫기'>×</Styled.CloseButton>
      <Styled.Title id='feedback-prompt-title'>{session.prompt.title}</Styled.Title>
      {session.prompt.description && <Styled.Description>{session.prompt.description}</Styled.Description>}
      {message ? <><Styled.Message>{message}</Styled.Message><Button width='100%' onClick={clearFeedbackPromptSession}>닫기</Button></> : <>
        <Styled.RatingList>{[...session.prompt.ratingOptions].sort((a, b) => a.displayOrder - b.displayOrder).map((option) => <Styled.RatingButton type='button' key={option.rating} $selected={rating === option.rating} disabled={isSubmitting} onClick={() => void selectRating(option.rating)}>{option.label}</Styled.RatingButton>)}</Styled.RatingList>
        {followUp && <Styled.FollowUp>
          {followUp.reasonOptions.filter((option) => option.active).length > 0 && <><Styled.Question>{followUp.reasonQuestion || '어떤 점이 아쉬웠나요?'}</Styled.Question><Styled.ReasonList>{followUp.reasonOptions.filter((option) => option.active).sort((a,b) => a.displayOrder - b.displayOrder).map((option) => <Styled.ReasonButton type='button' key={option.id} $selected={reasons.includes(option.id)} onClick={() => toggleReason(option.id)}>{option.label}</Styled.ReasonButton>)}</Styled.ReasonList></>}
          {followUp.commentMaxLength > 0 && <><Styled.Question>{followUp.commentQuestion || '추가 의견 (선택)'}</Styled.Question><Styled.Comment value={comment} maxLength={followUp.commentMaxLength} placeholder={followUp.commentPlaceholder} onChange={(event) => setComment(event.target.value)} /><Styled.Count>{comment.length}/{followUp.commentMaxLength}</Styled.Count></>}
          <Button width='100%' disabled={!canSubmit || isSubmitting} aria-busy={isSubmitting} onClick={() => void submit()}>{isSubmitting ? '전송 중...' : '제출하기'}</Button>
        </Styled.FollowUp>}
      </>}
    </Styled.Dialog>
  </Modal>;
};

const FeedbackPromptDialog = () => {
  const session = useFeedbackPrompt();
  if (!session) return null;
  return <FeedbackPromptDialogContent key={session.prompt.id} session={session} />;
};

export default FeedbackPromptDialog;
