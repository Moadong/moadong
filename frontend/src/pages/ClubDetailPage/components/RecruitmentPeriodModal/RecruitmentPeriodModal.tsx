import { useState } from 'react';
import { addDays, format, setYear } from 'date-fns';
import { ko } from 'date-fns/locale';
import InputField from '@/components/common/InputField/InputField';
import Modal from '@/components/common/Modal/Modal';
import ToggleButton from '@/components/common/ToggleButton/ToggleButton';
import {
  FAR_FUTURE_YEAR,
  PERIOD_CHANGE_DAYS_MAX,
} from '@/constants/adminFieldLimits';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useUpdateClubDescription } from '@/hooks/Queries/useClub';
import { ClubDetail } from '@/types/club';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import * as Styled from './RecruitmentPeriodModal.styles';

const formatPreview = (date: Date) => format(date, 'M월 d일', { locale: ko });

const formatShort = (date: Date | null) =>
  date ? format(date, 'MM.dd', { locale: ko }) : '?';

interface RecruitmentPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubDetail: ClubDetail;
  onSuccess: () => void;
}

const RecruitmentPeriodModal = ({
  isOpen,
  onClose,
  clubDetail,
  onSuccess,
}: RecruitmentPeriodModalProps) => {
  const [earlyCloseDays, setEarlyCloseDays] = useState('');
  const [extendDays, setExtendDays] = useState('');
  const [switchToAlways, setSwitchToAlways] = useState(false);

  const trackEvent = useMixpanelTrack();
  const { mutate: updateClubDescription, isPending } =
    useUpdateClubDescription();

  const isAlways = clubDetail.recruitmentStatus === 'ALWAYS';
  const currentEnd = recruitmentDateParser(clubDetail.recruitmentEnd);
  const currentStart = recruitmentDateParser(clubDetail.recruitmentStart);

  const earlyCloseNum = parseInt(earlyCloseDays, 10);
  const extendNum = parseInt(extendDays, 10);

  const validEarlyClose =
    earlyCloseDays !== '' && !isNaN(earlyCloseNum) && earlyCloseNum > 0;
  const validExtend =
    extendDays !== '' && !isNaN(extendNum) && extendNum > 0 && !!currentEnd;

  const exitAlwaysCanSubmit = isAlways && switchToAlways;
  const canSubmit =
    (validEarlyClose ||
      validExtend ||
      (!isAlways && switchToAlways) ||
      exitAlwaysCanSubmit) &&
    !isPending;

  const today = new Date();
  const earlyClosePreview = validEarlyClose
    ? addDays(today, earlyCloseNum)
    : null;
  const extendPreview =
    validExtend && currentEnd ? addDays(currentEnd, extendNum) : null;

  const exitAlwaysDefaultDate =
    isAlways && switchToAlways && !validEarlyClose ? currentStart : null;

  const handleEarlyCloseDaysChange = (value: string) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    if (value !== '' && parseInt(value, 10) > PERIOD_CHANGE_DAYS_MAX) return;
    setEarlyCloseDays(value);
    if (isAlways) {
      setSwitchToAlways(value !== '');
    } else {
      setExtendDays('');
      setSwitchToAlways(false);
    }
  };

  const handleExtendDaysChange = (value: string) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    if (value !== '' && parseInt(value, 10) > PERIOD_CHANGE_DAYS_MAX) return;
    setExtendDays(value);
    setEarlyCloseDays('');
    setSwitchToAlways(false);
  };

  const handleToggleAlways = () => {
    setSwitchToAlways((prev) => {
      const next = !prev;
      if (!isAlways && next) {
        setEarlyCloseDays('');
        setExtendDays('');
      }
      return next;
    });
  };

  const handleClose = () => {
    setEarlyCloseDays('');
    setExtendDays('');
    setSwitchToAlways(false);
    onClose();
  };

  const handleConfirm = () => {
    let newEnd: Date;
    let actionType: 'earlyClose' | 'extend' | 'switchToAlways' | 'exitAlways';
    let days: number | null = null;

    if (isAlways && switchToAlways) {
      actionType = 'exitAlways';
      if (validEarlyClose) {
        newEnd = addDays(today, earlyCloseNum);
        days = earlyCloseNum;
      } else {
        newEnd = currentStart ?? today;
      }
    } else if (!isAlways && switchToAlways) {
      actionType = 'switchToAlways';
      newEnd = setYear(currentStart ?? today, FAR_FUTURE_YEAR);
    } else if (validEarlyClose) {
      actionType = 'earlyClose';
      days = earlyCloseNum;
      newEnd = addDays(today, earlyCloseNum);
    } else if (validExtend && currentEnd) {
      actionType = 'extend';
      days = extendNum;
      newEnd = addDays(currentEnd, extendNum);
    } else {
      return;
    }

    updateClubDescription(
      {
        id: clubDetail.id,
        recruitmentStart: currentStart?.toISOString() ?? null,
        recruitmentEnd: newEnd.toISOString(),
        recruitmentTarget: clubDetail.recruitmentTarget,
      },
      {
        onSuccess: () => {
          trackEvent(ADMIN_EVENT.PERIOD_CHANGE_CONFIRMED, {
            clubId: clubDetail.id,
            actionType,
            days,
            previousStatus: clubDetail.recruitmentStatus,
          });
          handleClose();
          onSuccess();
        },
      },
    );
  };

  const currentPeriodText = isAlways
    ? '상시 모집 중'
    : `${formatShort(currentStart)} ~ ${formatShort(currentEnd)}`;

  const earlyCloseDisabled = !isAlways && switchToAlways;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Styled.Dialog
        role='dialog'
        aria-modal='true'
        aria-label='모집 기간 변경'
      >
        <Styled.Body>
          <Styled.Title>모집 기간 변경</Styled.Title>
          <Styled.PeriodDescription>
            현재 모집 기간: {currentPeriodText}
          </Styled.PeriodDescription>

          <Styled.Divider />

          <Styled.FieldsContainer>
            <Styled.FieldGroup>
              <Styled.FieldLabel>조기 마감</Styled.FieldLabel>
              <Styled.InputRow>
                <Styled.InputFieldWrapper>
                  <InputField
                    width='100%'
                    showClearButton={false}
                    placeholder='0'
                    value={earlyCloseDays}
                    onChange={(e) => handleEarlyCloseDaysChange(e.target.value)}
                    disabled={earlyCloseDisabled}
                  />
                </Styled.InputFieldWrapper>
                <Styled.InputSuffix>일 뒤 마감</Styled.InputSuffix>
                <Styled.Preview $empty={!earlyClosePreview}>
                  {earlyClosePreview
                    ? `→ ${formatPreview(earlyClosePreview)} 마감`
                    : '→ 날짜 미리보기'}
                </Styled.Preview>
              </Styled.InputRow>
            </Styled.FieldGroup>

            {!isAlways && (
              <Styled.FieldGroup>
                <Styled.FieldLabel>기간 연장</Styled.FieldLabel>
                <Styled.InputRow>
                  <Styled.InputFieldWrapper>
                    <InputField
                      width='100%'
                      showClearButton={false}
                      placeholder='0'
                      value={extendDays}
                      onChange={(e) => handleExtendDaysChange(e.target.value)}
                      disabled={switchToAlways}
                    />
                  </Styled.InputFieldWrapper>
                  <Styled.InputSuffix>일 연장</Styled.InputSuffix>
                  <Styled.Preview $empty={!extendPreview}>
                    {extendPreview
                      ? `→ ${formatPreview(extendPreview)}까지 연장`
                      : '→ 날짜 미리보기'}
                  </Styled.Preview>
                </Styled.InputRow>
              </Styled.FieldGroup>
            )}

            <Styled.AlwaysToggleWrapper>
              <ToggleButton
                active={switchToAlways}
                onClick={handleToggleAlways}
              >
                {isAlways ? '상시 모집 해제' : '상시 모집으로 전환'}
              </ToggleButton>
              {isAlways &&
                switchToAlways &&
                !validEarlyClose &&
                exitAlwaysDefaultDate && (
                  <Styled.AlwaysToggleHint>
                    일수 미입력 시 {formatPreview(exitAlwaysDefaultDate)}{' '}
                    기준으로 마감 설정
                  </Styled.AlwaysToggleHint>
                )}
            </Styled.AlwaysToggleWrapper>
          </Styled.FieldsContainer>
        </Styled.Body>

        <Styled.Footer>
          <Styled.FooterButton type='button' onClick={handleClose}>
            취소
          </Styled.FooterButton>
          <Styled.FooterButton
            type='button'
            $emphasized
            disabled={!canSubmit}
            onClick={handleConfirm}
          >
            확인
          </Styled.FooterButton>
        </Styled.Footer>
      </Styled.Dialog>
    </Modal>
  );
};

export default RecruitmentPeriodModal;
