import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Calendar from '@/pages/AdminPage/components/Calendar/Calendar';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import * as Styled from './RecruitEditTab.styles';
import InputField from '@/components/common/InputField/InputField';
import { useOutletContext } from 'react-router-dom';
import { ClubDetail } from '@/types/club';

const RecruitEditTab = () => {
  const clubDetail = useOutletContext<ClubDetail | null>();

  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(null);
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(null);
  const [recruitmentTarget, setRecruitmentTarget] = useState('');
  const [markdown, setMarkdown] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (clubDetail) {
      const { recruitmentStart: initialStart, recruitmentEnd: initialEnd } =
        parseRecruitmentPeriod(clubDetail.recruitmentPeriod ?? '');

      setRecruitmentStart(initialStart);
      setRecruitmentEnd(initialEnd);
      setRecruitmentTarget(clubDetail.recruitmentTarget || '');
      setMarkdown(clubDetail.description || '');
    }
  }, [clubDetail]);

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const beforeText = markdown.slice(0, selectionStart);
    const afterText = markdown.slice(selectionEnd);
    const newMarkdown = beforeText + text + afterText;

    setMarkdown(newMarkdown);
    setTimeout(() => {
      textareaRef.current!.selectionStart = selectionStart + text.length;
      textareaRef.current!.selectionEnd = selectionStart + text.length;
      textareaRef.current!.focus();
    }, 0);
  };

  return (
    <Styled.RecruitEditorContainer>
      <div>
        <h3>모집 기간 설정</h3>
        <br />
        <Calendar
          recruitmentStart={recruitmentStart}
          recruitmentEnd={recruitmentEnd}
          onChangeStart={setRecruitmentStart}
          onChangeEnd={setRecruitmentEnd}
        />
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
      <Styled.EditorContainer>
        <h3>소개글</h3>
        <br />
        <Styled.Toolbar>
          <button onClick={() => insertAtCursor('# 제목\n')}>제목1</button>
          <button onClick={() => insertAtCursor('## 소제목\n')}>제목2</button>
          <button onClick={() => insertAtCursor('**굵게**')}>B</button>
          <button onClick={() => insertAtCursor('_기울임_')}>I</button>
          <button onClick={() => insertAtCursor('> 인용문\n')}>“</button>
        </Styled.Toolbar>

        <Styled.Editor
          ref={textareaRef}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
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
          {markdown}
        </ReactMarkdown>
      </Styled.PreviewContainer>
    </Styled.RecruitEditorContainer>
  );
};

export default RecruitEditTab;
