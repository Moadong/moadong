import { PromotionArticle } from '@/types/promotion';
import CardMeta from './CardMeta/CardMeta';
import ClubTag from './ClubTag/ClubTag';
import DdayBadge from './DdayBadge/DdayBadge';
import * as Styled from './PromotionCard.styles';

interface PromotionCardProps {
  article: PromotionArticle;
}

const PromotionCard = ({ article }: PromotionCardProps) => {
  const imageUrl = article.images?.[0];
  
  return (
    <Styled.Container>
      <Styled.ImageWrapper>
        <Styled.Image $imageUrl={imageUrl} />
        <Styled.DdayWrapper>
          <DdayBadge startDate={article.eventStartDate} />
        </Styled.DdayWrapper>
      </Styled.ImageWrapper>

      <Styled.Content>
        <CardMeta
          title={article.title}
          location={article.location}
          startDate={article.eventStartDate}
         />
        <ClubTag clubName={article.clubName} />
      </Styled.Content>
    </Styled.Container>
  );
};

export default PromotionCard;
