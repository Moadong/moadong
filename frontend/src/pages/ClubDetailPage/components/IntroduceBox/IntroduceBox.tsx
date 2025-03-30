import React from 'react';
import * as Styled from './IntroduceBox.styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // 링크 및 마크다운 확장 지원
import rehypeRaw from 'rehype-raw'; // HTML 태그를 지원하려면 필요
import rehypeSanitize from 'rehype-sanitize';
import { SECTION_INDEX } from '@/constants/section';

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
        sectionRefs.current[SECTION_INDEX.DESCRIPTION_TAB] = el;
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
          }}>
          {description}
        </ReactMarkdown>
      </Styled.IntroduceContentBox>
    </Styled.IntroduceBoxWrapper>
  );
};

export default IntroduceBox;
