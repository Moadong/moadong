import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Calendar from '@/pages/AdminPage/components/Calendar/Calendar';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import * as Styled from './RecruitEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import { useOutletContext } from 'react-router-dom';
import { useUpdateClubDetail } from '@/hooks/queries/club/useUpdateClubDetail';
import { useUpdateClubDescription } from '@/hooks/queries/club/useUpdateClubDescription';
import AnimatedButton from '@/components/common/Button/AnimatedButton';
import { ClubDetail, ClubDescription } from '@/types/club';

const RecruitEditTab = () => {
  const clubDetail = useOutletContext<ClubDetail | null>();
  const { mutate: updateClub } = useUpdateClubDetail();
  const { mutate: updateClubDescription } = useUpdateClubDescription();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [description, setDescription] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const updatedData: Omit<Partial<ClubDetail>, 'id'> & {
      clubId: string;
      recruitmentStart: string | undefined;
      recruitmentEnd: string | undefined;
    } = {
      clubId: clubDetail.id,
      name: clubDetail.name,
      category: clubDetail.category,
      division: clubDetail.division,
      tags: clubDetail.tags,
      introduction: clubDetail.introduction,
      description: description,
      clubPresidentName: clubDetail.clubPresidentName,
      telephoneNumber: clubDetail.telephoneNumber,
      recruitmentStart: recruitmentStart?.toISOString(),
      recruitmentEnd: recruitmentEnd?.toISOString(),
      recruitmentTarget: recruitmentTarget,
    };

    const updatedDescription: ClubDescription = {
      clubId: clubDetail.id,
      description: description || clubDetail.description,
    };

    const results = await Promise.allSettled([
      new Promise((resolve, reject) => {
        updateClub(updatedData, {
          onSuccess: () => {
            setDescription(updatedData.description || '');
            resolve(null);
          },
          onError: reject,
        });
      }),
      new Promise((resolve, reject) => {
        updateClubDescription(updatedDescription, {
          onSuccess: () => {
            setDescription(updatedDescription.description || '');
            resolve(null);
          },
          onError: reject,
        });
      }),
    ]);

    const clubUpdateResult = results[0];
    const descriptionUpdateResult = results[1];

    if (
      clubUpdateResult.status === 'fulfilled' &&
      descriptionUpdateResult.status === 'fulfilled'
    ) {
      alert('동아리 정보가 성공적으로 수정되었습니다.');
    } else {
      alert(`동아리 정보 수정에 실패했습니다`);
    }
  };

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
          <AnimatedButton width={'150px'} onClick={handleUpdateClub}>
            수정하기
          </AnimatedButton>
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
    </Styled.RecruitEditorContainer>
  );
};

export default RecruitEditTab;
