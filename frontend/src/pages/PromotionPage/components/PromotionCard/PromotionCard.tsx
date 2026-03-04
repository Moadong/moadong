import CardMeta from './CardMeta/CardMeta';
import ClubTag from './ClubTag/ClubTag';
import DdayBadge from './DdayBadge/DdayBadge';
import * as Styled from './PromotionCard.styles';

const PromotionCard = () => {
  return (
    <Styled.Container>
      <Styled.ImageWrapper>
        <Styled.Image />
        <Styled.DdayWrapper>
          <DdayBadge />
        </Styled.DdayWrapper>
      </Styled.ImageWrapper>

      <Styled.Content>
        <CardMeta />
        <ClubTag />
      </Styled.Content>
    </Styled.Container>
  );
};

export default PromotionCard;
