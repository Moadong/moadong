import { useNavigate } from 'react-router-dom';
import * as Styled from './PromotionClubCTA.styles';

interface Props {
  clubId: string;
}

const PromotionClubCTA = ({ clubId }: Props) => {
  const navigate = useNavigate();

  return (
    <Styled.Container>
      <Styled.Question>
        동아리 정보가 궁금하다면?
      </Styled.Question>

      <Styled.Button
        onClick={() => navigate(`/club/${clubId}`)}
      >
        동아리 정보 보러가기 →
      </Styled.Button>
    </Styled.Container>
  );
};

export default PromotionClubCTA;