import PromotionCard from '../PromotionCard/PromotionCard';
import * as Styled from './PromotionGrid.styles';

const dummyPromotions = [1, 2, 3, 4];

const PromotionGrid = () => {
  return (
    <Styled.Grid>
      {dummyPromotions.map((promotion) => (
        <div key={promotion}>
          <PromotionCard />
        </div>
      ))}
    </Styled.Grid>
  );
};

export default PromotionGrid;
