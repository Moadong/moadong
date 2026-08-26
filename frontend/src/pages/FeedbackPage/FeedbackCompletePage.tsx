import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import * as Styled from './FeedbackCompletePage.styles';

/** 시안 ⑨ 전송 완료 — 2초 뒤 보낸 편지함으로 자동 복귀한다 */
const AUTO_RETURN_DELAY_MS = 2000;

const FeedbackCompletePage = () => {
  useTrackPageView(PAGE_VIEW.FEEDBACK_COMPLETE_PAGE);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/feedback?tab=sent', { replace: true });
    }, AUTO_RETURN_DELAY_MS);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Styled.Container>
      <Styled.Emoji role='img' aria-label='감사'>
        🙏
      </Styled.Emoji>
      <Styled.Title>편지가 잘 전송되었어요</Styled.Title>
      <Styled.Description>꼼꼼히 읽고 답장드릴게요</Styled.Description>
    </Styled.Container>
  );
};

export default FeedbackCompletePage;
