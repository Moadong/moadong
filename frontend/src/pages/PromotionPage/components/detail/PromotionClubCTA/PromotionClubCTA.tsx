import { useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestNavigateWebview } from '@/utils/webviewBridge';
import ArrowButton from '../PromotionArrowButton/PromotionArrowButton';
import * as Styled from './PromotionClubCTA.styles';

interface Props {
  clubId: string;
  clubName: string;
}

const PromotionClubCTA = ({ clubId, clubName }: Props) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleNavigate = () => {
    trackEvent(USER_EVENT.PROMOTION_CLUB_CTA_CLICKED, {
      club_id: clubId,
      club_name: clubName,
    });

    if (isInAppWebView()) {
      requestNavigateWebview(`club/${clubId}`);
    } else {
      navigate(`/clubDetail/@${encodeURIComponent(clubName)}`);
    }
  };

  return (
    <Styled.Container>
      <Styled.Question>동아리 정보가 궁금하다면?</Styled.Question>

      <ArrowButton
        text='동아리 정보 보러가기'
        direction='right'
        onClick={handleNavigate}
      />
    </Styled.Container>
  );
};

export default PromotionClubCTA;
