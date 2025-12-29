import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { setYear } from 'date-fns';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import { useUpdateClubDescription } from '@/hooks/queries/club/useUpdateClubDescription';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useTrackPageView from '@/hooks/useTrackPageView';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import Calendar from '@/pages/AdminPage/tabs/RecruitEditTab/components/Calendar/Calendar';
import { ClubDetail } from '@/types/club';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import * as Styled from './RecruitEditTab.styles';

const FAR_FUTURE_YEAR = 2999;

const RecruitEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.RECRUITMENT_INFO_EDIT_PAGE);

  const queryClient = useQueryClient();
  const { mutate: updateClubDescription } = useUpdateClubDescription();

  const clubDetail = useOutletContext<ClubDetail>();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');

  const [always, setAlways] = useState(false);

  const backupRangeRef = useRef<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const isFarFuture = (date: Date | null) =>
    !!date && date.getFullYear() === FAR_FUTURE_YEAR;

  useEffect(() => {
    if (!clubDetail) return;

    const now = new Date();
    const start = clubDetail.recruitmentStart
      ? recruitmentDateParser(clubDetail.recruitmentStart)
      : null;
    const end = clubDetail.recruitmentEnd
      ? recruitmentDateParser(clubDetail.recruitmentEnd)
      : null;
    const isAlways = isFarFuture(end);

    if (isAlways) {
      setAlways(true);
      backupRangeRef.current = { start, end };
      setRecruitmentStart(start ?? now);
    } else {
      setRecruitmentStart(start ?? now);
      setRecruitmentEnd(end ?? now);
    }

    setRecruitmentTarget((prev) => prev || clubDetail.recruitmentTarget || '');
  }, [clubDetail]);

  useEffect(() => {
    if (always && recruitmentStart) {
      setRecruitmentEnd(setYear(recruitmentStart, FAR_FUTURE_YEAR));
    }
  }, [always, recruitmentStart]);

  const toggleAlways = () => {
    trackEvent(ADMIN_EVENT.ALWAYS_RECRUIT_BUTTON_CLICKED);
    setAlways((prev) => {
      const now = new Date();

      if (!prev) {
        // 상시모집 활성화
        backupRangeRef.current = {
          start: recruitmentStart,
          end: recruitmentEnd,
        };
      } else {
        // 상시모집 비활성화
        const { start, end } = backupRangeRef.current;
        const backupWasAlways = isFarFuture(end);
        if (backupWasAlways) {
          // 백업이 상시모집인 경우
          const base = start ?? now;
          setRecruitmentStart(base);
          setRecruitmentEnd(base);
        } else {
          // 백업이 상시모집이 아닌 경우
          setRecruitmentStart(start ?? now);
          setRecruitmentEnd(end ?? now);
        }
      }
      return !prev;
    });
  };

  const handleUpdateClub = async () => {
    trackEvent(ADMIN_EVENT.UPDATE_RECRUIT_BUTTON_CLICKED);
    if (!clubDetail) return;

    let startForSave: Date | null = recruitmentStart;
    let endForSave: Date | null = recruitmentEnd;

    if (always) {
      const base = recruitmentStart ?? new Date();
      startForSave = base;
      endForSave = setYear(base, FAR_FUTURE_YEAR);
    }

    const updatedData = {
      id: clubDetail.id,
      recruitmentStart: startForSave?.toISOString() ?? null,
      recruitmentEnd: endForSave?.toISOString() ?? null,
      recruitmentTarget: recruitmentTarget,
    };

    updateClubDescription(updatedData, {
      onSuccess: () => {
        alert('모집 정보가 성공적으로 수정되었습니다.');
        queryClient.invalidateQueries({
          queryKey: ['clubDetail', clubDetail.id],
        });
      },
      onError: (error) => {
        alert(`모집 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

  return (
    <Styled.Container>
      <ContentSection>
        <ContentSection.Header
          title='모집 정보'
          action={
            <Button width={'135px'} animated onClick={handleUpdateClub}>
              저장하기
            </Button>
          }
        />

        <ContentSection.Body>
          <div>
            <Styled.Label>모집 기간</Styled.Label>
            <Styled.RecruitPeriodContainer>
              <Calendar
                recruitmentStart={recruitmentStart}
                recruitmentEnd={recruitmentEnd}
                onChangeStart={setRecruitmentStart}
                onChangeEnd={setRecruitmentEnd}
                disabledEnd={always}
              />
              <Styled.AlwaysRecruitButton
                type='button'
                $active={always}
                onClick={toggleAlways}
                aria-pressed={always}
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
            onClear={() => {
              trackEvent(ADMIN_EVENT.RECRUITMENT_TARGET_CLEAR_BUTTON_CLICKED);
              setRecruitmentTarget('');
            }}
            maxLength={10}
          />
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};
export default RecruitEditTab;
