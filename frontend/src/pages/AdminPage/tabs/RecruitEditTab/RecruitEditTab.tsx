import React, { useState, useEffect } from 'react';
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

const RecruitEditTab = () => {
  const clubDetail = useOutletContext<ClubDetail>();

  const { mutate: updateClubDescription } = useUpdateClubDescription();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [description, setDescription] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!clubDetail) return;

    const { recruitmentStart: initialStart, recruitmentEnd: initialEnd } =
      parseRecruitmentPeriod(clubDetail.recruitmentPeriod ?? '');

    setRecruitmentStart((prev) => prev ?? initialStart);
    setRecruitmentEnd((prev) => prev ?? initialEnd);
    setRecruitmentTarget((prev) => prev || clubDetail.recruitmentTarget || '');
    setDescription((prev) => prev || clubDetail.description || '');
  }, [clubDetail]);

  const handleUpdateClub = async () => {
    if (!clubDetail) return;

    const updatedData = {
      id: clubDetail.id,
      recruitmentStart: recruitmentStart?.toISOString(),
      recruitmentEnd: recruitmentEnd?.toISOString(),
      recruitmentTarget: recruitmentTarget,
      description: description,
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
          <Calendar
            recruitmentStart={recruitmentStart}
            recruitmentEnd={recruitmentEnd}
            onChangeStart={setRecruitmentStart}
            onChangeEnd={setRecruitmentEnd}
          />
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
