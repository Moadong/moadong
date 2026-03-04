import * as Styled from './PromotionCard.styles';

const PromotionCard = () => {
  return (
    <Styled.Container>
      <Styled.ImageWrapper>
        <Styled.Image />
        <Styled.DdayWrapper>
          {/* <Styled.DdayBadge /> */}
        </Styled.DdayWrapper>
      </Styled.ImageWrapper>

      <Styled.Content>
        <Styled.Title>💌✨WAP 최종 전시회 초대장 ✨💌</Styled.Title>
        {/* <CardMeta/> */}
        {/* <ClubTag /> */}
      </Styled.Content>
    </Styled.Container>
  );
};

export default PromotionCard;
