import { useNavigate } from 'react-router-dom';
import FixedBottomButtonArea from '@/components/common/FixedBottomButtonArea/FixedBottomButtonArea';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { RECRUIT_TARGET_MAX } from '@/constants/adminFieldLimits';
import ClearableTextArea from '@/pages/AdminPage/components/ClearableTextArea/ClearableTextArea';
import InfoSection from '@/pages/AdminPage/components/InfoSection/InfoSection';
import * as Styled from './RecruitEditTabMobile.styles';

const toDateTimeLocalValue = (date: Date | null): string => {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const fromDateTimeLocalValue = (value: string): Date | null => {
  if (!value) return null;
  return new Date(value);
};

interface RecruitEditTabMobileProps {
  recruitmentStart: Date | null;
  recruitmentEnd: Date | null;
  recruitmentTarget: string;
  isAlwaysRecruiting: boolean;
  isDirty: boolean;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  onTargetChange: (value: string) => void;
  onToggleAlwaysRecruiting: () => void;
  onSave: () => void;
}

const RecruitEditTabMobile = ({
  recruitmentStart,
  recruitmentEnd,
  recruitmentTarget,
  isAlwaysRecruiting,
  isDirty,
  onStartChange,
  onEndChange,
  onTargetChange,
  onToggleAlwaysRecruiting,
  onSave,
}: RecruitEditTabMobileProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar
          title='모집 정보 수정'
          onBack={() => navigate('/admin')}
        />

        <Styled.FormSection>
          <Styled.PageTitle>모집 정보를 입력해주세요</Styled.PageTitle>
          <Styled.PageSubtitle>
            해당 기간 동안 모집중 상태가 돼요
          </Styled.PageSubtitle>

          <Styled.FieldList>
            <Styled.PeriodSection>
              <Styled.SectionLabel>모집 기간</Styled.SectionLabel>
              <Styled.DateTimeRow>
                <Styled.DateTimeInput
                  type='datetime-local'
                  aria-label='모집 시작 일시'
                  value={toDateTimeLocalValue(recruitmentStart)}
                  onChange={(e) =>
                    onStartChange(fromDateTimeLocalValue(e.target.value))
                  }
                />
                <Styled.DateTimeInput
                  type='datetime-local'
                  aria-label='모집 종료 일시'
                  value={
                    isAlwaysRecruiting
                      ? toDateTimeLocalValue(recruitmentStart)
                      : toDateTimeLocalValue(recruitmentEnd)
                  }
                  onChange={(e) =>
                    onEndChange(fromDateTimeLocalValue(e.target.value))
                  }
                  $isDisabled={isAlwaysRecruiting}
                />
              </Styled.DateTimeRow>
              <Styled.AlwaysRecruitButton
                type='button'
                $isAlwaysActive={isAlwaysRecruiting}
                onClick={onToggleAlwaysRecruiting}
                aria-pressed={isAlwaysRecruiting}
              >
                상시모집
              </Styled.AlwaysRecruitButton>
            </Styled.PeriodSection>

            <InfoSection
              label='모집 대상'
              maxLength={RECRUIT_TARGET_MAX}
              currentLength={recruitmentTarget.length}
            >
              <ClearableTextArea
                value={recruitmentTarget}
                onChange={onTargetChange}
                onClear={() => onTargetChange('')}
                placeholder='모집대상을 입력해주세요'
                maxLength={RECRUIT_TARGET_MAX}
              />
            </InfoSection>
          </Styled.FieldList>
        </Styled.FormSection>
      </Styled.MobileContainer>

      <FixedBottomButtonArea onClick={onSave} disabled={!isDirty}>
        저장하기
      </FixedBottomButtonArea>
    </>
  );
};

export default RecruitEditTabMobile;
