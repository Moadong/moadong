import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Calendar from '@/pages/AdminPage/components/Calendar/Calendar';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import * as Styled from './RecruitEditTab.styles';

const RecruitEditTab = () => {
  const recruitmentPeriod = '2025.01.04 00:00 ~ 2025.06.04 00:00';

  const { recruitmentStart: initialStart, recruitmentEnd: initialEnd } =
    parseRecruitmentPeriod(recruitmentPeriod);
  const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(
    initialStart,
  );
  const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(initialEnd);

  const [markdown, setMarkdown] = useState<string>(
    '# Markdown Editor\n\nType here...',
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        <h2>모집 기간 설정</h2>
        <Calendar
          recruitmentStart={recruitmentStart}
          recruitmentEnd={recruitmentEnd}
          onChangeStart={setRecruitmentStart}
          onChangeEnd={setRecruitmentEnd}
        />
      </div>
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
