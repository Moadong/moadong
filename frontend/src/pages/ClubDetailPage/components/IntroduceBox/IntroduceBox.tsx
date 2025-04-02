import React from 'react';
import * as Styled from './IntroduceBox.styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 링크 및 마크다운 확장 지원
import rehypeRaw from 'rehype-raw'; // HTML 태그를 지원하려면 필요
import rehypeSanitize from 'rehype-sanitize';
import { INFOTABS_SCROLL_INDEX } from '@/constants/scrollSections';

const IntroduceBox = ({
  sectionRefs,
  description,
}: {
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
  description: string;
}) => {
  return (
    <Styled.IntroduceBoxWrapper
      ref={(el) => {
        sectionRefs.current[INFOTABS_SCROLL_INDEX.DESCRIPTION_TAB] = el;
      }}>
      <Styled.IntroduceTitle>소개글</Styled.IntroduceTitle>
      <Styled.IntroduceContentBox>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // GitHub 마크다운 지원
          rehypePlugins={[rehypeRaw, rehypeSanitize]} // HTML 태그 지원
          components={{
            a: ({ node, ...props }) => (
              <a {...props} target='_blank' rel='noopener noreferrer' />
            ),
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
      </Styled.IntroduceContentBox>
    </Styled.IntroduceBoxWrapper>
  );
};

export default IntroduceBox;
