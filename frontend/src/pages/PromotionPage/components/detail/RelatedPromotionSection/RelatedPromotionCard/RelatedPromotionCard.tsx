import { PromotionArticle } from '@/types/promotion';
import CardMeta from '../../../list/PromotionCard/CardMeta/CardMeta';
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
        description={article.description}
        location={article.location}
        startDate={article.eventStartDate}
      />
    </Styled.Card>
  );
};

export default RelatedPromotionCard;
