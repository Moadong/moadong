import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplication, getApplicationOptions } from '@/apis/application';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useVerifiedAdminClubId } from '@/hooks/Queries/useVerifiedAdminClubId';
import useNavigator from '@/hooks/useNavigator';
import { useAdminClubId } from '@/store/useAdminClubStore';
import { ApplicationForm, ApplicationFormMode } from '@/types/application';
import { asClubId } from '@/types/branded';
import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import AdminPeriodButton from '../AdminPeriodButton/AdminPeriodButton';
import ApplicationSelectModal from '../ApplicationSelectModal/ApplicationSelectModal';
import * as Styled from './ClubApplyButton.styles';

const ClubApplyButton = () => {
  const { clubId, clubName } = useParams<{
    clubId: string;
    clubName: string;
  }>();
  const navigate = useNavigate();
  const handleLink = useNavigator();
  const trackEvent = useMixpanelTrack();
  const { data: clubDetail } = useGetClubDetail((clubName ?? clubId) || '');
  const { clubId: adminClubId } = useAdminClubId();
  const { data: verifiedAdminClubId, isSuccess: isAdminVerified } =
    useVerifiedAdminClubId(adminClubId);

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationOptions, setApplicationOptions] = useState<
    ApplicationForm[]
  >([]);

  if (!clubId || !clubDetail) return null;

  const recruitmentStatus = clubDetail.recruitmentStatus;
  const isRecruitmentClosed = recruitmentStatus === 'CLOSED';
  const isRecruitmentUpcoming = recruitmentStatus === 'UPCOMING';
  const isAlwaysRecruiting = recruitmentStatus === 'ALWAYS';

  // 저장된 clubId가 아니라 토큰으로 확인한 clubId로 판단한다. 확인 전·실패 시에는 일반 지원 버튼을 보여준다.
  // data만 보면 안 된다. 재확인이 실패해도 React Query는 직전 성공 data를 남겨 둔다.
  const isAdmin =
    isAdminVerified && asClubId(verifiedAdminClubId) === clubDetail.id;
  const canManagePeriod =
    isAdmin && (recruitmentStatus === 'OPEN' || isAlwaysRecruiting);

  if (canManagePeriod) {
    return <AdminPeriodButton clubDetail={clubDetail} />;
  }

  const deadlineText = getDeadlineText(
    recruitmentDateParser(clubDetail.recruitmentStart),
    recruitmentDateParser(clubDetail.recruitmentEnd),
    recruitmentStatus,
  );

  const navigateToApplicationForm = async (formId: string) => {
    try {
      const formDetail = await getApplication(clubDetail.id, formId);

      if (formDetail?.formMode === ApplicationFormMode.EXTERNAL) {
        const externalApplicationUrl =
          formDetail.externalApplicationUrl?.trim();
        if (externalApplicationUrl) {
          handleLink(externalApplicationUrl);
          return;
        }
      }

      navigate(`/application/${clubDetail.id}/${formId}`, {
        state: { formDetail },
      });
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
      const forms = await getApplicationOptions(clubDetail.id);

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
    <>
      <FixedBottomButtonArea
        onClick={handleApplyButtonClick}
        disabled={isRecruitmentUpcoming || isRecruitmentClosed}
      >
        {renderButtonContent()}
      </FixedBottomButtonArea>
      <ApplicationSelectModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        applicationOptions={applicationOptions}
        onOptionSelect={handleSelectApplicationOption}
      />
    </>
  );
};

export default ClubApplyButton;
