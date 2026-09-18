import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Toast from '@/components/common/Toast/Toast';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { ClubDetail } from '@/types/club';
import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import RecruitmentPeriodModal from '../RecruitmentPeriodModal/RecruitmentPeriodModal';
import * as Styled from './AdminPeriodButton.styles';

interface AdminPeriodButtonProps {
  clubDetail: ClubDetail;
}

const AdminPeriodButton = ({ clubDetail }: AdminPeriodButtonProps) => {
  const trackEvent = useMixpanelTrack();
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false);

  const { recruitmentStatus } = clubDetail;
  const isAlwaysRecruiting = recruitmentStatus === 'ALWAYS';

  const deadlineText = getDeadlineText(
    recruitmentDateParser(clubDetail.recruitmentStart),
    recruitmentDateParser(clubDetail.recruitmentEnd),
    recruitmentStatus,
  );

  const endDate = recruitmentDateParser(clubDetail.recruitmentEnd);

  const statusText = isAlwaysRecruiting
    ? '상시 모집 중'
    : deadlineText
      ? `모집 중 · ${deadlineText}`
      : '모집 중';

  const dateRangeText =
    !isAlwaysRecruiting && endDate
      ? `(~ ${format(endDate, 'MM.dd', { locale: ko })} 마감)`
      : null;

  return (
    <>
      <Styled.ButtonArea>
        <Styled.StatusInfo>
          <Styled.StatusDot />
          <Styled.StatusText>{statusText}</Styled.StatusText>
          {dateRangeText && (
            <Styled.StatusDate>{dateRangeText}</Styled.StatusDate>
          )}
        </Styled.StatusInfo>
        <Styled.ChangePeriodButton
          type='button'
          onClick={() => {
            trackEvent(ADMIN_EVENT.PERIOD_CHANGE_BUTTON_CLICKED, {
              clubId: clubDetail.id,
            });
            setIsPeriodModalOpen(true);
          }}
        >
          모집 기간 변경
        </Styled.ChangePeriodButton>
      </Styled.ButtonArea>

      <RecruitmentPeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        clubDetail={clubDetail}
        onSuccess={() => setIsSuccessToastOpen(true)}
      />

      <Toast
        isOpen={isSuccessToastOpen}
        onClose={() => setIsSuccessToastOpen(false)}
        message='모집 기간이 변경됐어요.'
      />
    </>
  );
};

export default AdminPeriodButton;
