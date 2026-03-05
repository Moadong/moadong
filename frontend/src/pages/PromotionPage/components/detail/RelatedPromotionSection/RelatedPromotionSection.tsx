import * as Styled from './RelatedPromotionSection.styles';

interface Props {
  currentClubId: string;
}

const RelatedPromotionSection = ({ currentClubId }: Props) => {
  return (
    <Styled.Container>
      <Styled.Title>이런 이벤트는 어때요?</Styled.Title>

      <Styled.Card>
        <Styled.CardTitle>
          다른 동아리 행사 예시
        </Styled.CardTitle>
        <Styled.CardDesc>
          관련 이벤트 영역 (추후 API 연동)
        </Styled.CardDesc>
      </Styled.Card>
    </Styled.Container>
  );
};

export default RelatedPromotionSection;