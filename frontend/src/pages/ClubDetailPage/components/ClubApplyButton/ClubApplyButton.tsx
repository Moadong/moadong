import * as Styled from './ClubApplyButton.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import getApplication from '@/apis/application/getApplication';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { USER_EVENT } from '@/constants/eventName';
import { useState } from 'react';
import { ApplicationForm, ApplicationFormMode } from '@/types/application';
import getApplicationOptions from '@/apis/application/getApplicationOptions';
import ApplicationSelectModal from '@/components/application/modals/ApplicationSelectModal';
import ShareButton from '../ShareButton/ShareButton';

interface ClubApplyButtonProps {
  deadlineText?: string;
}

const ClubApplyButton = ({ deadlineText }: ClubApplyButtonProps) => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { data: clubDetail } = useGetClubDetail(clubId!);

  // 모달 옵션 상태
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ApplicationForm[]>([]);

  if (!clubId || !clubDetail) return null;

  // 내부 폼 이동
  const goWithForm = async (formId: string) => {
    try {
      const formDetail = await getApplication(clubId, formId);
      if (formDetail?.formMode === ApplicationFormMode.EXTERNAL) {
        const externalApplicationUrl =
          formDetail.externalApplicationUrl?.trim();
        if (externalApplicationUrl) {
          window.open(externalApplicationUrl, '_blank', 'noopener,noreferrer');
          return;
        }
      }
      navigate(`/application/${clubId}/${formId}`, { state: { formDetail } });
      setIsOpen(false);
    } catch (error) {
      console.error('지원서 조회 중 오류가 발생했습니다', error);
      alert(
        '지원서 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  // url 존재 시 외부, 내부 지원서 옵션에 따른 처리
  const openByOption = (option?: ApplicationForm) => {
    if (!option) return;
    void goWithForm(option.id);
  };

  const handleClick = async () => {
    trackEvent(USER_EVENT.CLUB_APPLY_BUTTON_CLICKED);

    if (isClosed) {
      alert(`현재 ${clubDetail.name} 동아리는 모집 기간이 아닙니다.`);
      return;
    }

    try {
      const list = await getApplicationOptions(clubId);

      if (list.length <= 0) {
        return;
      }

      if (list.length === 1) {
        await goWithForm(list[0].id);
        return;
      }
      setOptions(list);
      setIsOpen(true);
    } catch (e) {
      setOptions([]);
      setIsOpen(true);
      console.error('지원서 옵션 조회 중 오류가 발생했습니다.', e);
    }
  };

  const status = clubDetail.recruitmentStatus;
  const isClosed = status === 'CLOSED';
  const isUpcoming = status === 'UPCOMING';
  const isAlways = status === 'ALWAYS';

  const renderButtonContent = () => {
    if (isClosed || isUpcoming) {
      return deadlineText;
    }

    return (
      <>
        지원하기
        {!isAlways && deadlineText && (
          <>
            <Styled.Separator />
            {deadlineText}
          </>
        )}
      </>
    );
  };

  return (
    <Styled.ApplyButtonContainer>
      <ShareButton clubId={clubId} />
      <Styled.ApplyButton 
        disabled={isUpcoming || isClosed}
        onClick={handleClick}>
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