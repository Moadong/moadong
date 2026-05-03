import { useNavigate } from 'react-router-dom';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { getDDay } from '@/pages/PromotionPage/utils/getDday';
import { PromotionArticle } from '@/types/promotion';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestNavigateWebview } from '@/utils/webviewBridge';
import CardMeta from './CardMeta/CardMeta';
import ClubTag from './ClubTag/ClubTag';
import DdayBadge from './DdayBadge/DdayBadge';
import * as Styled from './PromotionCard.styles';

interface PromotionCardProps {
  article: PromotionArticle;
}

const PromotionCard = ({ article }: PromotionCardProps) => {
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();
  const dday = getDDay(article.eventStartDate, article.eventEndDate);

  const handleCardClick = () => {
    if (article.isFestival) {
      trackEvent(USER_EVENT.FESTIVAL_TAB_CLICKED, {
        tab: 'booth-map',
        source: 'promotion-card',
      });

      if (isInAppWebView()) {
        requestNavigateWebview('festival-introduction');
      } else {
        navigate('/festival-introduction');
      }
      return;
    }

    trackEvent(USER_EVENT.PROMOTION_CARD_CLICKED, {
      clubId: article.clubId,
    });

    if (isInAppWebView()) {
      requestNavigateWebview(`promotions/${article.id}`);
    } else {
      navigate(`/promotions/${article.id}`);
    }
  };

  const imageUrl = article.images?.[0];

  return (
    <Styled.Container onClick={handleCardClick}>
      <Styled.ImageWrapper>
        <Styled.Image $imageUrl={imageUrl} />
        <Styled.DdayWrapper>
          <DdayBadge dday={dday} />
        </Styled.DdayWrapper>
      </Styled.ImageWrapper>

      <Styled.Content>
        <CardMeta
          title={article.title}
          location={article.location}
          startDate={article.eventStartDate}
        />
        <Styled.TagWrapper>
          <ClubTag clubName={article.clubName} />
        </Styled.TagWrapper>
      </Styled.Content>
    </Styled.Container>
  );
};

export default PromotionCard;
