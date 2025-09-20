import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';
import getDeadlineText from '@/utils/getDeadLineText';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';
import { useState, useEffect } from 'react';

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

    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    color: #fff;
    text-align: center;

    img {
      font-size: 12px;
      font-weight: 600;
    }
  }
`;

interface ClubApplyButtonProps {
  deadlineText?: string;
}

const ClubApplyButton = ({ deadlineText }: ClubApplyButtonProps) => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const [ShareButtonComponent, setShareButtonComponent] =
    useState<React.ComponentType<{ clubId: string }> | null>(null);

  const { data: clubDetail } = useGetClubDetail(clubId!);

  useEffect(() => {
    if (deadlineText) {
      import('../ShareButton/ShareButton').then((module) => {
        setShareButtonComponent(() => module.default);
      });
    }
  }, [deadlineText]);

  const handleClick = async () => {
    trackEvent(EVENT_NAME.CLUB_APPLY_BUTTON_CLICKED);

    if (!clubId || !clubDetail) return;

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

    try {
      await getApplication(clubId);
      navigate(`/application/${clubId}`);
    } catch (err: unknown) {
      const externalFormLink = clubDetail.externalApplicationUrl?.trim();

      if (!externalFormLink) {
        alert('동아리 모집 정보를 확인해주세요.');
        return;
      }
      window.open(externalFormLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {ShareButtonComponent && <ShareButtonComponent clubId={clubId!} />}
      <Button onClick={handleClick}>
        지원하기
        {deadlineText && (
          <>
            <span style={{ margin: '0 8px', color: '#787878' }}>|</span>
            {deadlineText}
          </>
        )}
      </Button>
    </>
  );
};

export default ClubApplyButton;
