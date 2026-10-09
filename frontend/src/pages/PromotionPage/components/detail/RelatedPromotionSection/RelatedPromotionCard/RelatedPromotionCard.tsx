import CardMeta from '@/components/promotion/PromotionCardView/CardMeta/CardMeta';
import { PromotionArticle } from '@/types/promotion';
import ClubTag from '../../../list/PromotionCard/ClubTag/ClubTag';
import * as Styled from './RelatedPromotionCard.styles';

interface Props {
  article: PromotionArticle;
  onClick: () => void;
}

const RelatedPromotionCard = ({ article, onClick }: Props) => {
  return (
    <Styled.Card onClick={onClick}>
      <Styled.ClubTagWrapper>
        <ClubTag clubName={article.clubName} />
      </Styled.ClubTagWrapper>

      <CardMeta
        title={article.title}
        location={article.location}
        startDate={article.eventStartDate}
        endDate={article.eventEndDate}
      />
    </Styled.Card>
  );
};

export default RelatedPromotionCard;
