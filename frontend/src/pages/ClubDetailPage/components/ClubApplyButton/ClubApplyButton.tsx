import * as Styled from './ClubApplyButton.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';
import getDeadlineText from '@/utils/getDeadLineText';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';
import ShareButton from '../ShareButton/ShareButton';

interface ClubApplyButtonProps {
  deadlineText?: string;
}

const ClubApplyButton = ({ deadlineText }: ClubApplyButtonProps) => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const { data: clubDetail } = useGetClubDetail(clubId!);

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

  // 모집 마감 시 "모집 마감 "
  // 상시 모집 시 span, deadlineText 제거

  return (
    <Styled.ApplyButtonContainer>
      <ShareButton clubId={clubId!} />
      <Styled.ApplyButton onClick={handleClick}>
        지원하기
        <span style={{ margin: '0 8px', color: '#787878' }}>|</span>
        {deadlineText}
      </Styled.ApplyButton>
    </Styled.ApplyButtonContainer>
  );
};

export default ClubApplyButton;
