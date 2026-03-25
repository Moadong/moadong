import { useNavigate } from 'react-router-dom';
import { getDDay } from '@/pages/PromotionPage/utils/getDday';
import { PromotionArticle } from '@/types/promotion';
import RelatedPromotionCard from './RelatedPromotionCard/RelatedPromotionCard';
import * as Styled from './RelatedPromotionSection.styles';

interface Props {
  currentClubId: string;
  articles: PromotionArticle[];
}

const RelatedPromotionSection = ({ currentClubId, articles }: Props) => {
  const navigate = useNavigate();

  const activeEvents = articles
    .filter((article) => {
      const dday = getDDay(article.eventStartDate, article.eventEndDate);
      return article.clubId !== currentClubId && dday >= 0;
    })
    .slice(0, 1);

  if (activeEvents.length === 0) return null;

  return (
    <Styled.Container>
      <Styled.Title>이런 이벤트는 어때요?</Styled.Title>

      {activeEvents.map((event) => (
        <RelatedPromotionCard
          key={event.clubId}
          article={event}
          onClick={() => navigate(`/promotions/${event.clubId}`)}
        />
      ))}
    </Styled.Container>
  );
};

export default RelatedPromotionSection;
