import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { setYear } from 'date-fns';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useUpdateClubDescription } from '@/hooks/Queries/useClub';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { ClubDetail } from '@/types/club';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import DateTimeRangePicker from './components/DateTimeRangePicker/DateTimeRangePicker';
import * as Styled from './RecruitEditTab.styles';

const FAR_FUTURE_YEAR = 2999;

const RecruitEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.RECRUITMENT_INFO_EDIT_PAGE);

  const { mutate: updateClubDescription } = useUpdateClubDescription();
  const clubDetail = useOutletContext<ClubDetail>();

  // 모집 정보 상태 관리
  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [isAlwaysRecruiting, setIsAlwaysRecruiting] = useState(false);

  const backupRangeRef = useRef<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const isFarFuture = (date: Date | null) => {
    return date?.getFullYear() === FAR_FUTURE_YEAR;
  };

  const handleStartChange = (newStart: Date | null) => {
    setRecruitmentStart(newStart);
    if (
      !isAlwaysRecruiting &&
      newStart &&
      recruitmentEnd &&
      newStart > recruitmentEnd
    ) {
      setRecruitmentEnd(newStart);
    }
  };

  const handleEndChange = (newEnd: Date | null) => {
    setRecruitmentEnd(newEnd);
    if (newEnd && recruitmentStart && newEnd < recruitmentStart) {
      setRecruitmentStart(newEnd);
    }
  };

  useEffect(() => {
    if (!clubDetail) return;

    const parsedStart = clubDetail.recruitmentStart
      ? recruitmentDateParser(clubDetail.recruitmentStart)
      : new Date();
    const parsedEnd = clubDetail.recruitmentEnd
      ? recruitmentDateParser(clubDetail.recruitmentEnd)
      : new Date();
    const isAlways = isFarFuture(parsedEnd);

    setIsAlwaysRecruiting(isAlways);
    setRecruitmentStart(parsedStart);
    setRecruitmentEnd(parsedEnd);
    setRecruitmentTarget(clubDetail.recruitmentTarget || '');

    if (isAlways)
      backupRangeRef.current = { start: parsedStart, end: parsedEnd };
  }, [clubDetail]);

  useEffect(() => {
    if (isAlwaysRecruiting && recruitmentStart) {
      setRecruitmentEnd(setYear(recruitmentStart, FAR_FUTURE_YEAR));
    }
  }, [isAlwaysRecruiting, recruitmentStart]);

  const toggleAlwaysRecruiting = () => {
    trackEvent(ADMIN_EVENT.ALWAYS_RECRUIT_BUTTON_CLICKED);

    setIsAlwaysRecruiting((prevMode) => {
      const nextMode = !prevMode;
      const now = new Date();
      if (nextMode) {
        // 상시모집 활성화 시 현재 날짜 백업
        backupRangeRef.current = {
          start: recruitmentStart,
          end: recruitmentEnd,
        };
      } else {
        // 상시모집 비활성화 시 백업 데이터 복구
        const backup = backupRangeRef.current;
        const baseDate = backup.start || now;

        setRecruitmentStart(baseDate);

        if (isFarFuture(backup.end)) {
          setRecruitmentEnd(baseDate);
        } else {
          setRecruitmentEnd(backup.end || now);
        }
      }
      return nextMode;
    });
  };

  const handleUpdateClub = async () => {
    trackEvent(ADMIN_EVENT.UPDATE_RECRUIT_BUTTON_CLICKED);
    if (!clubDetail) return;

    const updatedData = {
      id: clubDetail.id,
      recruitmentStart: recruitmentStart?.toISOString() ?? null,
      recruitmentEnd: recruitmentEnd?.toISOString() ?? null,
      recruitmentTarget,
    };

    updateClubDescription(updatedData, {
      onSuccess: () => alert('모집 정보가 성공적으로 수정되었습니다.'),
      onError: (error) =>
        alert(`모집 정보 수정에 실패했습니다: ${error.message}`),
    });
  };

  return (
    <Styled.Container>
      <ContentSection>
        <ContentSection.Header
          title='모집 정보'
          action={
            <Button width='135px' animated onClick={handleUpdateClub}>
              저장하기
            </Button>
          }
        />
        <ContentSection.Body>
          <div>
            <Styled.Label>모집 기간</Styled.Label>
            <Styled.RecruitPeriodContainer>
              <DateTimeRangePicker
                recruitmentStart={recruitmentStart}
                recruitmentEnd={recruitmentEnd}
                onChangeRecruitmentStart={handleStartChange}
                onChangeRecruitmentEnd={handleEndChange}
                disabledEnd={isAlwaysRecruiting}
              />
              <Styled.AlwaysRecruitButton
                type='button'
                $isAlwaysActive={isAlwaysRecruiting}
                onClick={toggleAlwaysRecruiting}
                aria-pressed={isAlwaysRecruiting}
              >
                상시모집
              </Styled.AlwaysRecruitButton>
            </Styled.RecruitPeriodContainer>
          </div>
          <InputField
            label='모집 대상'
            placeholder='모집대상을 입력해주세요'
            type='text'
            value={recruitmentTarget}
            onChange={(e) => setRecruitmentTarget(e.target.value)}
            onClear={() => setRecruitmentTarget('')}
            maxLength={10}
          />
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};

export default RecruitEditTab;
