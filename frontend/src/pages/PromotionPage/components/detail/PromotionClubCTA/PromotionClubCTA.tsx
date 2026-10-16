import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useNavigator from '@/hooks/useNavigator';
import useWebviewSubscribe from '@/hooks/useWebviewSubscribe';
import isInAppWebView from '@/utils/isInAppWebView';
import ArrowButton from '../PromotionArrowButton/PromotionArrowButton';
import * as Styled from './PromotionClubCTA.styles';

interface Props {
  clubId: string;
  clubName: string;
}

const PromotionClubCTA = ({ clubId, clubName }: Props) => {
  const handleLink = useNavigator();
  const trackEvent = useMixpanelTrack();
  const { subscribedClubIds } = useWebviewSubscribe();

  const handleNavigate = () => {
    trackEvent(USER_EVENT.PROMOTION_CLUB_CTA_CLICKED, {
      club_id: clubId,
      club_name: clubName,
    });

    const isSubscribed = isInAppWebView() && subscribedClubIds.has(clubId);
    const url = isSubscribed
      ? `/clubDetail/@${encodeURIComponent(clubName)}?is_subscribed=true`
      : `/clubDetail/@${encodeURIComponent(clubName)}`;
    handleLink(url);
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
