import * as Styled from './PromotionGrid.styles';

const dummyPromotions = [1, 2, 3, 4];

const PromotionGrid = () => {
  return (
    <Styled.Grid>
      {dummyPromotions.map((promotion) => (
        <div key={promotion}>
          <h2>홍보 카드 {promotion}</h2>
        </div>
      ))}
    </Styled.Grid>
  );
};

export default PromotionGrid;
