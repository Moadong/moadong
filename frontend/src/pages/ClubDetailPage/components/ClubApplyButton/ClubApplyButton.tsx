import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';
import getDeadlineText from '@/utils/getDeadLineText';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';

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

const ClubApplyButton = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const { data: clubDetail } = useGetClubDetail(clubId!);

  const handleClick = async () => {
    if (!clubId || !clubDetail) return;

    trackEvent('Club Apply Button Clicked');

    const { recruitmentStart, recruitmentEnd } = parseRecruitmentPeriod(
      clubDetail.recruitmentPeriod,
    );
    const deadlineText = getDeadlineText(
      recruitmentStart,
      recruitmentEnd,
      new Date(),
    );

    if (deadlineText === '모집 마감') {
      alert(`현재 ${clubDetail.name} 동아리는 모집 기간이 아닙니다.`);
      return;
    }

    // 모아동 지원서 확인
    try {
      await getApplication(clubId);
      navigate(`/application/${clubId}`);
    } catch (err: unknown) {
      const externalFormLink = clubDetail.externalApplicationUrl?.trim();

      if (externalFormLink) {
        window.open(externalFormLink, '_blank', 'noopener,noreferrer');
      } else {
        alert('동아리 모집 정보를 확인해주세요.');
      }
    }
  };

  return <Button onClick={handleClick}>지원하기</Button>;
};

export default ClubApplyButton;
