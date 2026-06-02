import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useNavigator from '@/hooks/useNavigator';
import { getDDay } from '@/pages/PromotionPage/utils/getDday';
import { PromotionArticle } from '@/types/promotion';
import CardMeta from './CardMeta/CardMeta';
import ClubTag from './ClubTag/ClubTag';
import DdayBadge from './DdayBadge/DdayBadge';
import * as Styled from './PromotionCard.styles';

interface PromotionCardProps {
  article: PromotionArticle;
}

const PromotionCard = ({ article }: PromotionCardProps) => {
  const trackEvent = useMixpanelTrack();
  const handleLink = useNavigator();
  const dday = getDDay(article.eventStartDate, article.eventEndDate);

  const handleCardClick = () => {
    trackEvent(USER_EVENT.PROMOTION_CARD_CLICKED, {
      promotionId: article.id,
    });

    handleLink(`/promotions/${article.id}`);
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
