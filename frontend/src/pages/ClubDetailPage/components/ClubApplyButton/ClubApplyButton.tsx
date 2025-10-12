import * as Styled from './ClubApplyButton.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';
import ShareButton from '@/pages/ClubDetailPage/components/ShareButton/ShareButton';
import { useState } from 'react';
import { ApplicationOption } from '@/types/application';
import getApplicationOptions from '@/apis/application/getApplicationOptions';
import ApplicationSelectModal from '@/components/application/modals/ApplicationSelectModal';

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

  // 모달 옵션 상태
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ApplicationOption[]>([])

  const openByOption = (option?: ApplicationOption) => {
    if (!clubId) return;
    if (option?.url) {
      // 외부 폼
      window.open(option.url, '_blank'); 
    } else {
      // 내부 폼
      navigate(`/application/${clubId}`); 
    }
    setIsOpen(false);
  };

  if (!clubId || !clubDetail) return null;

  const handleClick = async () => {
    trackEvent(EVENT_NAME.CLUB_APPLY_BUTTON_CLICKED);

    if (deadlineText === RECRUITMENT_STATUS.CLOSED) {
      alert(`현재 ${clubDetail.name} 동아리는 모집 기간이 아닙니다.`);
      return;
    }

    try {
      const list = await getApplicationOptions(clubId);

      if (list.length === 1) {
        openByOption(list[0]);
        return;
      }

      if (list.length >= 2) {
        setOptions(list);
        setIsOpen(true);
        return;
      }
      setOptions([]);
      setIsOpen(true);
      return;

    } catch {
      try {
        await getApplication(clubId);
        navigate(`/application/${clubId}`);
        setIsOpen(false);
      } catch {
        const externalForm = clubDetail.externalApplicationUrl?.trim();
        if (externalForm) {
          window.open(externalForm, '_blank');
          setIsOpen(false);
        } else {
          setOptions([]);
        }
      }
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
      <ApplicationSelectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        options={options}
        onSelect={openByOption}
      />
    </Styled.ApplyButtonContainer>
  );
};

export default ClubApplyButton;
