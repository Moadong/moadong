import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/common/Modal/Modal';
import {
  APP_STORE_REVIEW_URL,
  PLAY_STORE_REVIEW_URL,
} from '@/constants/appReview';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useNavigator from '@/hooks/useNavigator';
import useSatisfactionSurvey from '@/hooks/useSatisfactionSurvey';
import * as Styled from './SatisfactionModal.styles';

const isIOS = () => /(iPhone|iPad|iPod)/.test(navigator.userAgent);

/**
 * 충분히 써본 사용자에게 만족도를 묻는다 (시안 11170:1014).
 * 만족하면 스토어 리뷰로 보내고, 아니면 우체통으로 보내 불만을 우리가 먼저 받는다.
 */
const SatisfactionModal = () => {
  const { isOpen, closeForever, snooze } = useSatisfactionSurvey();
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
    closeForever();
    handleLink(isIOS() ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL);
  };

  // 불만은 스토어로 보내지 않는다. 우리가 먼저 받는다.
  const handleUnsatisfied = () => {
    trackEvent(USER_EVENT.SATISFACTION_ANSWERED, { satisfied: false });
    closeForever();
    navigate('/feedback/write');
  };

  const handleSnooze = () => {
    trackEvent(USER_EVENT.SATISFACTION_SNOOZED);
    snooze();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleSnooze} closeOnBackdrop={false}>
      <Styled.Dialog role='dialog' aria-modal='true'>
        <Styled.Title>모아동, 잘 사용하고 계신가요?</Styled.Title>
        <Styled.Actions>
          <Styled.ActionButton type='button' onClick={handleUnsatisfied}>
            아니요
          </Styled.ActionButton>
          <Styled.ActionButton type='button' $primary onClick={handleSatisfied}>
            넵!
          </Styled.ActionButton>
        </Styled.Actions>
        <Styled.SnoozeButton type='button' onClick={handleSnooze}>
          다음에 볼게요
        </Styled.SnoozeButton>
      </Styled.Dialog>
    </Modal>
  );
};

export default SatisfactionModal;
