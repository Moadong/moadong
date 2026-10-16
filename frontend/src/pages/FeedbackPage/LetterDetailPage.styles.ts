import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 500px;
  min-height: 100dvh;
  margin: 0 auto;
  padding-bottom: 40px;
  background: ${colors.base.white};
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.04);

  ${media.mobile} {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 335px;
  margin: 0 auto;
`;

export const Message = styled.p`
  padding: 60px 20px;
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[600]};
  text-align: center;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const Title = styled.h1`
  ${setTypography(typography.title.title4)};
  color: ${colors.base.black};
  letter-spacing: -0.44px;
`;

export const SentAt = styled.p`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: ${colors.gray[600]};
  letter-spacing: -0.24px;
`;

const cardStyles = `
  border-radius: 14px;
  background: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
`;

/** 답장 편지에만 붙는 '내가 보낸 편지' 인용 카드 */
export const QuoteCard = styled.button`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  text-align: left;
  cursor: pointer;
`;

export const QuoteLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: ${colors.gray[600]};
  letter-spacing: -0.24px;
`;

export const QuoteBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const QuoteContent = styled.p`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[800]};
  letter-spacing: -0.28px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const QuoteMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TimeAgo = styled.span`
  ${setTypography(typography.button.button2)};
  color: ${colors.gray[600]};
  letter-spacing: -0.24px;
`;

/**
 * 편지 본문은 분류와 무관하게 마크다운으로 온다.
 * 어드민 에디터 툴바(시안 11175:1014)가 H2·H3·볼드·이탤릭·링크·인용·목록·구분선·이미지를
 * 제공하므로 그 요소들을 모두 스타일링한다. 빠뜨리면 브라우저 기본 스타일로 렌더된다.
 */
export const BodyCard = styled.div`
  ${cardStyles}
  padding: 16px 18px;
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[900]};
  letter-spacing: -0.28px;
  overflow-wrap: break-word;

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  p {
    margin: 0 0 1.4em;
  }

  h2 {
    margin: 1.6em 0 0.4em;
    ${setTypography(typography.title.title6)};
    color: ${colors.base.black};
    letter-spacing: -0.32px;
  }

  /* 수집한 상세 시안(11366:19430)의 소제목이 본문과 같은 크기의 볼드였다 */
  h3 {
    margin: 1.4em 0 0.2em;
    font-size: 14px;
    font-weight: 700;
    line-height: 140%;
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  a {
    color: ${colors.primary[900]};
    text-decoration: underline;
  }

  blockquote {
    margin: 1.2em 0;
    padding-left: 12px;
    border-left: 3px solid ${colors.gray[300]};
    color: ${colors.gray[700]};
  }

  ul,
  ol {
    margin: 0 0 1.4em;
    padding-left: 20px;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  li {
    margin-bottom: 0.3em;
  }

  hr {
    margin: 1.6em 0;
    border: none;
    border-top: 1px solid ${colors.gray[300]};
  }

  img {
    width: 100%;
    margin: 18px 0;
    border-radius: 8px;
  }
`;
