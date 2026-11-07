import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import {
  APP_STORE_REVIEW_URL,
  PLAY_STORE_REVIEW_URL,
} from '@/constants/appReview';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useNavigator from '@/hooks/useNavigator';
import useSatisfactionSurvey from '@/hooks/useSatisfactionSurvey';
import isIOS from '@/utils/isIOS';

const SATISFACTION_MODAL_TEXT = {
  MAIN: '솔직한 의견이 더 나은 모아동을 만들어요\n여러분의 한 마디가 큰 힘이 돼요',
  REVIEW:
    '저희 앱을 이용해주셔서 감사합니다.\n앱이 마음에 드셨다면 리뷰를 남겨주세요!',
  FEEDBACK: '불편한 점이나 건의사항을\n저희에게 알려주세요!',
} as const;

/**
 * 충분히 써본 사용자에게 만족도를 묻는다 (시안 11170:1014).
 * 만족하면 스토어 리뷰 유도 모달을, 아쉬우면 피드백 유도 모달을 한 번 더 띄운다.
 * 첫 질문을 ESC로 닫으면 스누즈다. 답한 뒤의 안내 모달은 넘겨도 다시 묻지 않는다.
 */
const SatisfactionModal = () => {
  const { isOpen, answer, snooze } = useSatisfactionSurvey();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const handleLink = useNavigator();

  // 응답률을 구하려면 노출 자체를 남겨야 한다. 리렌더로 중복되지 않게 ref로 막는다.
  const trackedShownRef = useRef(false);
  useEffect(() => {
    if (!isOpen || trackedShownRef.current) return;

    trackedShownRef.current = true;
    trackEvent(USER_EVENT.SATISFACTION_MODAL_VIEWED);
  }, [isOpen, trackEvent]);

  const handleSatisfied = () => {
    trackEvent(USER_EVENT.SATISFACTION_ANSWERED, { satisfied: true });
    answer();
    setIsReviewModalOpen(true);
  };

  // 불만은 스토어로 보내지 않는다. 우리가 먼저 받는다.
  const handleUnsatisfied = () => {
    trackEvent(USER_EVENT.SATISFACTION_ANSWERED, { satisfied: false });
    answer();
    setIsFeedbackModalOpen(true);
  };

  const handleReviewConfirm = () => {
    trackEvent(USER_EVENT.SATISFACTION_REVIEW_CLICKED);
    setIsReviewModalOpen(false);
    handleLink(isIOS() ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL);
  };

  const handleFeedbackConfirm = () => {
    trackEvent(USER_EVENT.SATISFACTION_FEEDBACK_CLICKED);
    setIsFeedbackModalOpen(false);
    navigate('/feedback/write');
  };

  const handleSnooze = () => {
    trackEvent(USER_EVENT.SATISFACTION_SNOOZED, { step: 'question' });
    snooze();
  };

  // 이미 답했으므로 스누즈가 아니다. 이벤트만 같은 이름에 step으로 나눠 남긴다.
  const handleReviewLater = () => {
    trackEvent(USER_EVENT.SATISFACTION_SNOOZED, { step: 'review' });
    setIsReviewModalOpen(false);
  };

  const handleFeedbackLater = () => {
    trackEvent(USER_EVENT.SATISFACTION_SNOOZED, { step: 'feedback' });
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        onClose={handleSnooze}
        title='모아동, 잘 사용하고 계신가요?'
        description={SATISFACTION_MODAL_TEXT.MAIN}
        variant='check'
        actions={[
          {
            label: '아쉬워요',
            variant: 'secondary',
            onClick: handleUnsatisfied,
          },
          { label: '좋아요!', variant: 'primary', onClick: handleSatisfied },
        ]}
      />
      <ConfirmModal
        isOpen={isReviewModalOpen}
        onClose={handleReviewLater}
        title='앱이 마음에 드시나요?'
        description={SATISFACTION_MODAL_TEXT.REVIEW}
        variant='check'
        actions={[
          {
            label: '나중에 할게요',
            variant: 'secondary',
            onClick: handleReviewLater,
          },
          {
            label: '물론이죠!',
            variant: 'primary',
            onClick: handleReviewConfirm,
          },
        ]}
      />
      <ConfirmModal
        isOpen={isFeedbackModalOpen}
        onClose={handleFeedbackLater}
        title='함께 개선해요'
        description={SATISFACTION_MODAL_TEXT.FEEDBACK}
        variant='warning'
        actions={[
          {
            label: '다음에 할게요',
            variant: 'secondary',
            onClick: handleFeedbackLater,
          },
          {
            label: '피드백하기',
            variant: 'primary',
            onClick: handleFeedbackConfirm,
          },
        ]}
      />
    </>
  );
};

export default SatisfactionModal;
