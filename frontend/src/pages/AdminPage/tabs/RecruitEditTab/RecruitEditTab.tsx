import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUpdateClubDescription } from '@/hooks/queries/club/useUpdateClubDescription';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';
import { ClubDetail } from '@/types/club';
import { useQueryClient } from '@tanstack/react-query';
import { setYear } from 'date-fns';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/useTrackPageView';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopRecruitEditTab from './DesktopRecruitEditTab';
import MobileRecruitEditTab from './MobileRecruitEditTab';

const RecruitEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.RECRUITMENT_INFO_EDIT_PAGE);
  const isMobile = useIsMobileView();

  const clubDetail = useOutletContext<ClubDetail>();

  const { mutate: updateClubDescription } = useUpdateClubDescription();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [description, setDescription] = useState('');
  const FAR_FUTURE_YEAR = 2999;
  const isFarFuture = (date: Date | null) =>
    !!date && date.getFullYear() === FAR_FUTURE_YEAR;
  const [always, setAlways] = useState(false);
  const backupRangeRef = useRef<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!clubDetail) return;

    const { recruitmentStart: initialStart, recruitmentEnd: initialEnd } =
      parseRecruitmentPeriod(clubDetail.recruitmentPeriod ?? '');

    const now = new Date();
    const start = correctResponseKoreanDate(initialStart);
    const end = correctResponseKoreanDate(initialEnd);
    const isAlways = clubDetail.recruitmentStatus === '상시모집';

    if (isAlways) {
      setAlways(true);
      backupRangeRef.current = { start, end };
      setRecruitmentStart(start ?? now);
    } else {
      setRecruitmentStart(start ?? now);
      setRecruitmentEnd(end ?? now);
    }

    setRecruitmentTarget((prev) => prev || clubDetail.recruitmentTarget || '');
    setDescription((prev) => prev || clubDetail.description || '');
  }, [clubDetail]);

  useEffect(() => {
    if (always && recruitmentStart) {
      setRecruitmentEnd(setYear(recruitmentStart, FAR_FUTURE_YEAR));
    }
  }, [always, recruitmentStart]);

  const correctRequestKoreanDate = (date: Date | null): Date | null => {
    if (!date) return null;
    return new Date(date?.getTime() + 9 * 60 * 60 * 1000);
  };

  const correctResponseKoreanDate = (date: Date | null): Date | null => {
    if (!date) return null;
    return new Date(date?.getTime() - 9 * 60 * 60 * 1000);
  };

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
      recruitmentStart: correctRequestKoreanDate(startForSave)?.toISOString(),
      recruitmentEnd: correctRequestKoreanDate(endForSave)?.toISOString(),
      recruitmentTarget: recruitmentTarget,
      description: description,
      externalApplicationUrl: clubDetail.externalApplicationUrl ?? '',
    };
    updateClubDescription(updatedData, {
      onSuccess: () => {
        alert('동아리 정보가 성공적으로 수정되었습니다.');
        queryClient.invalidateQueries({
          queryKey: ['clubDetail', clubDetail.id],
        });
      },
      onError: (error) => {
        alert(`동아리 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

  const props = {
    recruitmentStart,
    setRecruitmentStart,
    recruitmentEnd,
    setRecruitmentEnd,
    recruitmentTarget,
    setRecruitmentTarget,
    description,
    setDescription,
    always,
    toggleAlways,
    handleUpdateClub,
    trackEvent,
  };

  return isMobile ? (
    <MobileRecruitEditTab {...props} />
  ) : (
    <DesktopRecruitEditTab {...props} />
  );
};
export default RecruitEditTab;
