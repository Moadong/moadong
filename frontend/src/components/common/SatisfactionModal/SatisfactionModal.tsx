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

/**
 * 충분히 써본 사용자에게 만족도를 묻는다 (시안 11170:1014).
 * 만족하면 스토어 리뷰 유도 모달을, 아쉬우면 피드백 유도 모달을 한 번 더 띄운다.
 * ESC·백드롭 클릭은 스누즈로 처리한다.
 */
const SatisfactionModal = () => {
  const { isOpen, closeFirst, closeForever, snooze } = useSatisfactionSurvey();
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
    trackEvent(USER_EVENT.SATISFACTION_SHOWN);
  }, [isOpen, trackEvent]);

  const handleSatisfied = () => {
    trackEvent(USER_EVENT.SATISFACTION_ANSWERED, { satisfied: true });
    closeFirst();
    setIsReviewModalOpen(true);
  };

  // 불만은 스토어로 보내지 않는다. 우리가 먼저 받는다.
  const handleUnsatisfied = () => {
    trackEvent(USER_EVENT.SATISFACTION_ANSWERED, { satisfied: false });
    closeFirst();
    setIsFeedbackModalOpen(true);
  };

  const handleReviewConfirm = () => {
    trackEvent(USER_EVENT.SATISFACTION_REVIEWED);
    closeForever();
    setIsReviewModalOpen(false);
    handleLink(isIOS() ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL);
  };

  const handleFeedbackConfirm = () => {
    trackEvent(USER_EVENT.SATISFACTION_FEEDBACK);
    closeForever();
    setIsFeedbackModalOpen(false);
    navigate('/feedback/write');
  };

  const handleSnooze = () => {
    trackEvent(USER_EVENT.SATISFACTION_SNOOZED);
    snooze();
    setIsReviewModalOpen(false);
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        onClose={handleSnooze}
        onCancel={handleUnsatisfied}
        cancelLabel='아쉬워요'
        onConfirm={handleSatisfied}
        confirmLabel='좋아요!'
        title='모아동, 잘 사용하고 계신가요?'
        description={
          '솔직한 의견이 더 나은 모아동을 만들어요\n여러분의 한 마디가 큰 힘이 돼요'
        }
        variant='check'
        closeOnBackdrop={false}
      />
      <ConfirmModal
        isOpen={isReviewModalOpen}
        onClose={handleSnooze}
        onConfirm={handleReviewConfirm}
        cancelLabel='나중에 할게요'
        confirmLabel='물론이죠!'
        title='앱이 마음에 드시나요?'
        description={`저희 앱을 이용해주셔서 감사합니다.\n앱이 마음에 드셨다면 리뷰를 남겨주세요!`}
        variant='check'
        closeOnBackdrop={false}
      />
      <ConfirmModal
        isOpen={isFeedbackModalOpen}
        onClose={handleSnooze}
        onConfirm={handleFeedbackConfirm}
        cancelLabel='다음에 할게요'
        confirmLabel='피드백하기'
        title='함께 개선해요'
        description={'불편한 점이나 건의사항을\n저희에게 알려주세요!'}
        variant='warning'
        closeOnBackdrop={false}
      />
    </>
  );
};

export default SatisfactionModal;
