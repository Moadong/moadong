import { useNavigate } from 'react-router-dom';
import ArrowButton from '../PromotionArrowButton/PromotionArrowButton';
import * as Styled from './PromotionClubCTA.styles';

interface Props {
  clubId: string;
}

const PromotionClubCTA = ({ clubId }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <Styled.Container>
      <Styled.Question>동아리 정보가 궁금하다면?</Styled.Question>

      <ArrowButton
        text='동아리 정보 보러가기'
        direction='right'
        onClick={handleNavigate}
      />
    </Styled.Container>
  );
};

export default PromotionClubCTA;
