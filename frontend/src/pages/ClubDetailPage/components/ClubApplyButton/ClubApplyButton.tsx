import * as Styled from './ClubApplyButton.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';
import ShareButton from '@/pages/ClubDetailPage/components/ShareButton/ShareButton';

interface ClubApplyButtonProps {
  deadlineText?: string;
}

const RECRUITMENT_STATUS = {
  ALWAYS: '상시 모집',
  CLOSED: '모집 마감',
};

const ClubApplyButton = ({ deadlineText }: ClubApplyButtonProps) => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();

  const { data: clubDetail } = useGetClubDetail(clubId!);

  if (!clubId || !clubDetail) return;

  const handleClick = async () => {
    trackEvent(EVENT_NAME.CLUB_APPLY_BUTTON_CLICKED);

    if (deadlineText === RECRUITMENT_STATUS.CLOSED) {
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

  const renderButtonContent = () => {
    if (deadlineText === RECRUITMENT_STATUS.CLOSED) {
      return RECRUITMENT_STATUS.CLOSED;
    }

    return (
      <>
        지원하기
        {deadlineText && deadlineText !== RECRUITMENT_STATUS.ALWAYS && (
          <>
            <span style={{ margin: '0 8px', color: '#787878' }}>|</span>
            {deadlineText}
          </>
        )}
      </>
    );
  };

  return (
    <Styled.ApplyButtonContainer>
      <ShareButton clubId={clubId} />
      <Styled.ApplyButton onClick={handleClick}>
        {renderButtonContent()}
      </Styled.ApplyButton>
    </Styled.ApplyButtonContainer>
  );
};

export default ClubApplyButton;
