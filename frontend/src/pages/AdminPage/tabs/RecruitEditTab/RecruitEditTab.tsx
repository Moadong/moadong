import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as Styled from './RecruitEditTab.styles';
import Calendar from '@/pages/AdminPage/components/Calendar/Calendar';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import ImageUpload from '@/pages/AdminPage/components/ImageUpload/ImageUpload';
import { ImagePreview } from '@/pages/AdminPage/components/ImagePreview/ImagePreview';
import { useUpdateClubDescription } from '@/hooks/queries/club/useUpdateClubDescription';
import useUpdateFeedImages from '@/hooks/queries/club/useUpdateFeedImages';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import { ClubDetail } from '@/types/club';
import { useQueryClient } from '@tanstack/react-query';
import MarkdownEditor from '@/pages/AdminPage/components/MarkdownEditor/MarkdownEditor';

const RecruitEditTab = () => {
  const clubDetail = useOutletContext<ClubDetail>();

  const { mutate: updateClubDescription } = useUpdateClubDescription();
  const { mutate: updateFeedImages } = useUpdateFeedImages();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [description, setDescription] = useState('');
  const [imageList, setImageList] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const beforeText = description.slice(0, selectionStart);
    const afterText = description.slice(selectionEnd);
    const markedDownDescription = beforeText + text + afterText;

    setDescription(markedDownDescription);
    setTimeout(() => {
      textareaRef.current!.selectionStart = selectionStart + text.length;
      textareaRef.current!.selectionEnd = selectionStart + text.length;
      textareaRef.current!.focus();
    }, 0);
  };

  const addImage = (newImage: string) => {
    setImageList((prev) => {
      const updatedList = [...prev, newImage];

      updateFeedImages(
        {
          feeds: updatedList,
          clubId: clubDetail.id,
        },
        {
          onSuccess: () => {
            alert('이미지가 성공적으로 추가되었습니다.');
            queryClient.invalidateQueries({
              queryKey: ['clubDetail', clubDetail.id],
            });
          },
          onError: (error) => {
            alert(`이미지 추가에 실패했습니다: ${error.message}`);
          },
        },
      );

      return updatedList;
    });
  };

  const deleteImage = (index: number) => {
    const newList = imageList.filter((_, i) => i !== index);
    updateFeedImages(
      {
        feeds: newList,
        clubId: clubDetail.id,
      },
      {
        onSuccess: () => {
          alert('이미지가 성공적으로 삭제되었습니다.');
          setImageList(newList);
          queryClient.invalidateQueries({
            queryKey: ['clubDetail', clubDetail.id],
          });
        },
        onError: (error) => {
          alert(`이미지 삭제에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  useEffect(() => {
    if (!clubDetail) return;

    const { recruitmentStart: initialStart, recruitmentEnd: initialEnd } =
      parseRecruitmentPeriod(clubDetail.recruitmentPeriod ?? '');

    setRecruitmentStart((prev) => prev ?? initialStart);
    setRecruitmentEnd((prev) => prev ?? initialEnd);
    setRecruitmentTarget((prev) => prev || clubDetail.recruitmentTarget || '');
    setDescription((prev) => prev || clubDetail.description || '');

    setImageList(clubDetail.feeds || []);
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
        queryClient.invalidateQueries({
          queryKey: ['clubDetail', clubDetail.id],
        });
      },
      onError: (error) => {
        alert(`동아리 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

  // [x]FIXME: div 컴포넌트 수정
  return (
    <Styled.RecruitEditorContainer>
      <div>
        <h3>모집 기간 설정</h3>
        <br />
        <Styled.EditButtonContainer>
          <Calendar
            recruitmentStart={recruitmentStart}
            recruitmentEnd={recruitmentEnd}
            onChangeStart={setRecruitmentStart}
            onChangeEnd={setRecruitmentEnd}
          />
          <Button width={'150px'} animated onClick={handleUpdateClub}>
            수정하기
          </Button>
        </Styled.EditButtonContainer>
      </div>
      <div>
        <h3>모집 대상 설정</h3>
        <br />
        <InputField
          label=''
          placeholder='모집 대상을 입력해주세요.'
          type='text'
          value={recruitmentTarget}
          onChange={(e) => setRecruitmentTarget(e.target.value)}
          onClear={() => setRecruitmentTarget('')}
          maxLength={10}
        />
      </div>

      <h3>소개글 수정</h3>
      <MarkdownEditor value={description} onChange={setDescription} />
    </Styled.RecruitEditorContainer>
  );
};
export default RecruitEditTab;
