import { useNavigate } from 'react-router-dom';
import { PromotionArticle } from '@/types/promotion';
import { getDDay } from '@/utils/getDday';
import CardMeta from './CardMeta/CardMeta';
import ClubTag from './ClubTag/ClubTag';
import DdayBadge from './DdayBadge/DdayBadge';
import * as Styled from './PromotionCard.styles';

interface PromotionCardProps {
  article: PromotionArticle;
}

const PromotionCard = ({
  article,
}: PromotionCardProps) => {
  const navigateToPromotionDetail = useNavigate();
  const dday = getDDay(article.eventStartDate);

  const handleCardClick = () => {
    navigateToPromotionDetail(`/promotions/${article.clubId}`);
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
          description={article.description}
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
