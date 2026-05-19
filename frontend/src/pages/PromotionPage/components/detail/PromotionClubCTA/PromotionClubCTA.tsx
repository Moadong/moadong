import { useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useNavigator from '@/hooks/useNavigator';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestNavigateWebview } from '@/utils/webviewBridge';
import ArrowButton from '../PromotionArrowButton/PromotionArrowButton';
import * as Styled from './PromotionClubCTA.styles';

interface Props {
  clubId: string;
  clubName: string;
}

const PromotionClubCTA = ({ clubId, clubName }: Props) => {
  const handleLink = useNavigator();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const handleNavigate = () => {
    trackEvent(USER_EVENT.PROMOTION_CLUB_CTA_CLICKED, {
      club_id: clubId,
      club_name: clubName,
    });

    if (isInAppWebView()) {
      // 웹뷰: club/:id slug로 bridge 전송. bridge 미주입 시 SPA 직접 이동
      const sent = requestNavigateWebview(`club/${clubId}`);
      if (!sent) navigate(`/clubDetail/${clubId}`);
    } else {
      handleLink(`/clubDetail/${clubId}`);
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
