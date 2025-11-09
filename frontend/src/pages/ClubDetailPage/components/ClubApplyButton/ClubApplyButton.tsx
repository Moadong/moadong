import * as Styled from './ClubApplyButton.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { EVENT_NAME } from '@/constants/eventName';
import ShareButton from '@/pages/ClubDetailPage/components/ShareButton/ShareButton';
import { useState } from 'react';
import { ApplicationForm } from '@/types/application';
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
  const [options, setOptions] = useState<ApplicationForm[]>([]);

  if (!clubId || !clubDetail) return null;

  const goWithForm = async (formId: string) => {
    try {
      const formDetail = await getApplication(clubId, formId);
      navigate(`/application/${clubId}/${formId}`, { state: { formDetail } });
      setIsOpen(false);
    } catch (error) {
      console.error('지원서 조회 중 오류가 발생했습니다', error);
      alert('지원서 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const openByOption = (option?: ApplicationForm) => {
    if (!option) return;
    void goWithForm(option.id);
  };

  const handleClick = async () => {
    trackEvent(EVENT_NAME.CLUB_APPLY_BUTTON_CLICKED);

    if (deadlineText === RECRUITMENT_STATUS.CLOSED) {
      alert(`현재 ${clubDetail.name} 동아리는 모집 기간이 아닙니다.`);
      return;
    }

    try {
      const list = await getApplicationOptions(clubId);

      if (list.length <= 0) {
        alert('현재 지원 가능한 지원서가 없습니다.');
      } else if (list.length === 1) {
        await goWithForm(list[0].id);
      } else {
        setOptions(list);
        setIsOpen(true);
      }
    } catch (e) {
      console.error('지원서 옵션 조회 중 오류가 발생했습니다.', e);
      alert('지원서 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
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
