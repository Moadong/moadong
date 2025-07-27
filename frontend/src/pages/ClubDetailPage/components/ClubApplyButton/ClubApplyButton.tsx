import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';

interface ButtonProps {
  isRecruiting: boolean;
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  background-color: #3a3a3a;
  color: white;
  font-weight: bold;

  width: 148px;
  height: 44px;
  font-size: 1.25rem;

  &:hover {
    background-color: #555;
    transform: scale(1.03);
  }

  @media (max-width: 500px) {
    width: 256px;
    height: 44px;
    font-size: 1rem;
  }
`;

const ClubApplyButton = ({ isRecruiting }: ButtonProps) => {
  const { clubId } = useParams<{ clubId: string }>();
  const trackEvent = useMixpanelTrack();
  const navigate = useNavigate();

  const handleClick = () => {
    trackEvent('Club Apply Button Clicked');

    //TODO: 지원서를 작성한 동아리의 경우에만 리다이렉트
    if (!isRecruiting) {
      alert('지원모집이 마감되었습니다. 다음에 지원해 주세요.');
      return;
    }
    navigate(`/application/${clubId}`, { replace: true });
  };

  return <Button onClick={handleClick}>지원하기</Button>;
};

export default ClubApplyButton;
