import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as Styled from './RecruitEditTab.styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

const MAX_IMAGES = 5;

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
    updateFeedImages({
      feeds: [...imageList, newImage],
      clubId: clubDetail.id,
    });
    setImageList([...imageList, newImage]);
  };

  const deleteImage = (index: number) => {
    updateFeedImages({
      feeds: imageList.filter((_, i) => i !== index),
      clubId: clubDetail.id,
    });
    setImageList(imageList.filter((_, i) => i !== index));
  };

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
        <h3>모집 대상</h3>
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

      <h3>소개글</h3>
      <Styled.EditorPreviewContainer>
        <Styled.EditorContainer>
          <Styled.Toolbar>
            <button onClick={() => insertAtCursor('# 제목\n')}>제목1</button>
            <button onClick={() => insertAtCursor('## 소제목\n')}>제목2</button>
            <button onClick={() => insertAtCursor('**굵게**')}>B</button>
            <button onClick={() => insertAtCursor('_기울임_')}>I</button>
            <button onClick={() => insertAtCursor('> 인용문\n')}>“</button>
          </Styled.Toolbar>

          <Styled.Editor
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='소개글을 작성해주세요...'
          />
        </Styled.EditorContainer>

        <Styled.PreviewContainer>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return <Styled.Paragraph>{children}</Styled.Paragraph>;
              },
              blockquote({ children }) {
                return <Styled.Blockquote>{children}</Styled.Blockquote>;
              },
              ol({ children }) {
                return <Styled.OrderedList>{children}</Styled.OrderedList>;
              },
              ul({ children }) {
                return <Styled.UnorderedList>{children}</Styled.UnorderedList>;
              },
              li({ children }) {
                return <Styled.ListItem>{children}</Styled.ListItem>;
              },
            }}>
            {description}
          </ReactMarkdown>
        </Styled.PreviewContainer>
      </Styled.EditorPreviewContainer>

      <h3>활동 사진 편집</h3>
      <Styled.ImageContainer>
        <Styled.ImageGrid>
          {imageList.map((image, index) => (
            <ImagePreview
              key={`${image}-${index}`}
              image={image}
              onDelete={() => deleteImage(index)}
            />
          ))}
          {imageList.length < MAX_IMAGES && (
            <ImageUpload
              key='add-image'
              onChangeImageList={addImage}
              clubId={clubDetail.id}
            />
          )}
        </Styled.ImageGrid>
      </Styled.ImageContainer>
    </Styled.RecruitEditorContainer>
  );
};
export default RecruitEditTab;
