import { useNavigate } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import { FEEDBACK_TYPE_ORDER } from '@/constants/feedback';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import type { FeedbackType } from '@/types/feedback';
import FeedbackTypeCard from './components/FeedbackTypeCard';
import * as Styled from './FeedbackTypeSelectPage.styles';

const FeedbackTypeSelectPage = () => {
  useTrackPageView(PAGE_VIEW.FEEDBACK_TYPE_SELECT_PAGE);
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();

  const handleSelect = (type: FeedbackType) => {
    trackEvent(USER_EVENT.FEEDBACK_TYPE_SELECTED, { type });
    navigate(`/feedback/write/${type.toLowerCase()}`);
  };

  return (
    <Styled.Container>
      <WebviewTopBar title='' />
      <Styled.Content>
        <Styled.Heading>
          <Styled.Title>
            어떤 피드백을
            <br />
            모아동 팀에게 보낼까요?
          </Styled.Title>
          <Styled.Description>
            어떤 의견이든 괜찮아요. 직접 다 읽고 한 분 한 분 답장드려요.
          </Styled.Description>
        </Styled.Heading>
        <Styled.CardList>
          {FEEDBACK_TYPE_ORDER.map((type) => (
            <FeedbackTypeCard key={type} type={type} onClick={handleSelect} />
          ))}
        </Styled.CardList>
      </Styled.Content>
    </Styled.Container>
  );
};

export default FeedbackTypeSelectPage;
