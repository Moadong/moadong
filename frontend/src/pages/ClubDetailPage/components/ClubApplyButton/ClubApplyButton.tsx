import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication, getApplicationOptions } from '@/apis/application';
import ApplicationSelectModal from '@/components/application/modals/ApplicationSelectModal';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { ApplicationForm, ApplicationFormMode } from '@/types/application';
import ShareButton from '../ShareButton/ShareButton';
import * as Styled from './ClubApplyButton.styles';

interface ClubApplyButtonProps {
  deadlineText?: string;
}

const ClubApplyButton = ({ deadlineText }: ClubApplyButtonProps) => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { data: clubDetail } = useGetClubDetail(clubId!);

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationOptions, setApplicationOptions] = useState<
    ApplicationForm[]
  >([]);

  if (!clubId || !clubDetail) return null;

  const navigateToApplicationForm = async (formId: string) => {
    try {
      const formDetail = await getApplication(clubId, formId);
      if (formDetail?.formMode === ApplicationFormMode.EXTERNAL) {
        const externalApplicationUrl =
          formDetail.externalApplicationUrl?.trim();
        if (externalApplicationUrl) {
          const link = document.createElement('a');
          link.href = externalApplicationUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.click();
          return;
        }
      }
      navigate(`/application/${clubId}/${formId}`, { state: { formDetail } });
      setIsApplicationModalOpen(false);
    } catch (error) {
      console.error('지원서 조회 중 오류가 발생했습니다', error);
      alert(
        '지원서 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleSelectApplicationOption = (option?: ApplicationForm) => {
    if (!option) return;
    void navigateToApplicationForm(option.id);
  };

  const handleApplyButtonClick = async () => {
    trackEvent(USER_EVENT.CLUB_APPLY_BUTTON_CLICKED);

    if (isRecruitmentClosed) {
      alert(`현재 ${clubDetail.name} 동아리는 모집 기간이 아닙니다.`);
      return;
    }

    try {
      const forms = await getApplicationOptions(clubId);

      if (forms.length <= 0) {
        return;
      }

      if (forms.length === 1) {
        await navigateToApplicationForm(forms[0].id);
        return;
      }
      setApplicationOptions(forms);
      setIsApplicationModalOpen(true);
    } catch (e) {
      setApplicationOptions([]);
      setIsApplicationModalOpen(true);
      console.error('지원서 옵션 조회 중 오류가 발생했습니다.', e);
    }
  };

  const recruitmentStatus = clubDetail.recruitmentStatus;
  const isRecruitmentClosed = recruitmentStatus === 'CLOSED';
  const isRecruitmentUpcoming = recruitmentStatus === 'UPCOMING';
  const isAlwaysRecruiting = recruitmentStatus === 'ALWAYS';

  const renderButtonContent = () => {
    if (isRecruitmentClosed || isRecruitmentUpcoming) {
      return deadlineText;
    }

    return (
      <>
        지원하기
        {!isAlwaysRecruiting && deadlineText && (
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
        disabled={isRecruitmentUpcoming || isRecruitmentClosed}
        onClick={handleApplyButtonClick}
      >
        {renderButtonContent()}
      </Styled.ApplyButton>
      <ApplicationSelectModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        applicationOptions={applicationOptions}
        onOptionSelect={handleSelectApplicationOption}
      />
    </Styled.ApplyButtonContainer>
  );
};

export default ClubApplyButton;
