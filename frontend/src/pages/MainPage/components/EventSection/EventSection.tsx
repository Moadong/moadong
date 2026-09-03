import { useGetPromotionArticles } from '@/hooks/Queries/usePromotion';
import PromotionCard from '@/pages/PromotionPage/components/list/PromotionCard/PromotionCard';
import * as Styled from './EventSection.styles';

const VISIBLE_COUNT = 2;

const EventSection = () => {
  const { data, isLoading, isError } = useGetPromotionArticles();

  const articles = data?.slice(0, VISIBLE_COUNT) ?? [];

  if (isLoading || isError || articles.length === 0) return null;

  return (
    <Styled.Section>
      <Styled.Title>놓치면 안되는 행사</Styled.Title>
      <Styled.CardGrid>
        {articles.map((article) => (
          <PromotionCard key={article.id} article={article} />
        ))}
      </Styled.CardGrid>
    </Styled.Section>
  );
};

export default EventSection;
