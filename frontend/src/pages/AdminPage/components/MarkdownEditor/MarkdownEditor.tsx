import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as Styled from './MarkdownEditor.styles';
import eye_icon from '@/assets/images/icons/eye_icon.svg';
import pencil_icon from '@/assets/images/icons/pencil_icon.svg';
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const newValue = before + text + after;

    onChange(newValue);

    setTimeout(() => {
      textareaRef.current!.selectionStart = selectionStart + text.length;
      textareaRef.current!.selectionEnd = selectionStart + text.length;
      textareaRef.current!.focus();
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, showPreview]);

  return (
    <Styled.EditorContainer>
      <Styled.Toolbar>
        <button onClick={() => insertAtCursor('# 제목\n')}>제목1</button>
        <button onClick={() => insertAtCursor('## 소제목\n')}>제목2</button>
        <button onClick={() => insertAtCursor('**굵게**')}>B</button>
        <button onClick={() => insertAtCursor('_기울임_')}>I</button>
        <button onClick={() => insertAtCursor('> 인용문\n')}>“</button>
        <Styled.Spacer />
        <button onClick={() => setShowPreview((prev) => !prev)}>
          <img
            src={showPreview ? pencil_icon : eye_icon}
            alt={showPreview ? '소개글 편집하기' : '소개글 미리보기'}
          />
          {showPreview ? '소개글 편집하기' : '소개글 미리보기'}
        </button>
      </Styled.Toolbar>

      {!showPreview && (
        <Styled.Editor
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder='소개글을 작성해주세요...'
        />
      )}

      {showPreview && (
        <Styled.PreviewContainer>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <Styled.Paragraph>{children}</Styled.Paragraph>
              ),
              blockquote: ({ children }) => (
                <Styled.Blockquote>{children}</Styled.Blockquote>
              ),
              ol: ({ children }) => (
                <Styled.OrderedList>{children}</Styled.OrderedList>
              ),
              ul: ({ children }) => (
                <Styled.UnorderedList>{children}</Styled.UnorderedList>
              ),
              li: ({ children }) => (
                <Styled.ListItem>{children}</Styled.ListItem>
              ),
            }}>
            {value}
          </ReactMarkdown>
        </Styled.PreviewContainer>
      )}
    </Styled.EditorContainer>
  );
};

export default MarkdownEditor;
