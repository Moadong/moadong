import { PromotionArticle } from '@/types/promotion';
import PromotionCard from '../PromotionCard/PromotionCard';
import * as Styled from './PromotionGrid.styles';

interface PromotionGridProps {
  articles: PromotionArticle[];
}

const PromotionGrid = ({ articles }: PromotionGridProps) => {
  return (
    <Styled.Grid>
      {articles.map((article) => (
        <PromotionCard 
          key={article.clubId + article.title} 
          article={article} 
        />
      ))}
    </Styled.Grid>
  );
};

export default PromotionGrid;
