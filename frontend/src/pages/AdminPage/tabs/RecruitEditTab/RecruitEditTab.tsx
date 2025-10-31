import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as Styled from './RecruitEditTab.styles';
import Calendar from '@/pages/AdminPage/tabs/RecruitEditTab/components/Calendar/Calendar';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import { useUpdateClubDescription } from '@/hooks/queries/club/useUpdateClubDescription';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';
import { ClubDetail } from '@/types/club';
import { useQueryClient } from '@tanstack/react-query';
import MarkdownEditor from '@/pages/AdminPage/tabs/RecruitEditTab/components/MarkdownEditor/MarkdownEditor';
import { setYear } from 'date-fns';

const RecruitEditTab = () => {
  const clubDetail = useOutletContext<ClubDetail>();

  const { mutate: updateClubDescription } = useUpdateClubDescription();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [description, setDescription] = useState('');
  const FAR_FUTURE_YEAR = 2999;
  const isFarFuture = (date: Date | null) => !!date && date.getFullYear() === FAR_FUTURE_YEAR;
  const [always, setAlways] = useState(false);
  const backupRangeRef = useRef<{ start: Date | null; end: Date | null }>({ start: null, end: null });

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
  }

  const correctResponseKoreanDate = (date: Date | null): Date | null => {
    if (!date) return null;
    return new Date(date?.getTime() - 9 * 60 * 60 * 1000);
  }

  const toggleAlways = () => {
    setAlways((prev) => {
      const now = new Date();

      if (!prev) {
        // 상시모집 활성화
        backupRangeRef.current = { start: recruitmentStart, end: recruitmentEnd };
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

  return (
    <Styled.RecruitEditorContainer>
      <Styled.TitleButtonContainer>
        <Styled.InfoTitle>동아리 모집 정보 수정</Styled.InfoTitle>
        <Button width={'150px'} animated onClick={handleUpdateClub}>
          수정하기
        </Button>
      </Styled.TitleButtonContainer>
      <Styled.InfoGroup>
        <div>
          <Styled.Label>모집 기간 설정</Styled.Label>
          <Styled.RecruitPeriodContainer>
            <Calendar
              recruitmentStart={recruitmentStart}
              recruitmentEnd={recruitmentEnd}
              onChangeStart={setRecruitmentStart}
              onChangeEnd={setRecruitmentEnd}
              disabledEnd={always}
            />
            <Styled.AlwaysRecruitButton
              type="button"
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
          placeholder='모집 대상을 입력해주세요.'
          type='text'
          value={recruitmentTarget}
          onChange={(e) => setRecruitmentTarget(e.target.value)}
          onClear={() => setRecruitmentTarget('')}
          maxLength={10}
        />

        <div>
          <Styled.Label>소개글 수정</Styled.Label>
          <MarkdownEditor value={description} onChange={setDescription} />
        </div>
      </Styled.InfoGroup>
    </Styled.RecruitEditorContainer>
  );
};
export default RecruitEditTab;
