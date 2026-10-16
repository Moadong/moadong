import styled, { css } from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { setTypography } from '@/styles/theme/typography';

export const Main = styled.main<{ $hasFixedHeader: boolean }>`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ theme }) => theme.colors.gray[900]};

  ${media.mobile} {
    padding: 24px 16px 60px;
  }

  /* 웹 헤더는 fixed라 높이만큼 더 내려야 제목이 가려지지 않는다.
     웹뷰 상단바는 sticky라 자리를 차지하므로 필요 없다 */
  ${({ $hasFixedHeader }) =>
    $hasFixedHeader &&
    css`
      padding-top: ${HEADER_HEIGHT.desktop + 40}px;

      ${media.tablet} {
        padding-top: ${HEADER_HEIGHT.tablet + 32}px;
      }

      ${media.mobile} {
        padding-top: ${HEADER_HEIGHT.mobile + 24}px;
      }
    `}
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title3)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 16px;
`;

export const Intro = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p6)};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: 40px;
`;

export const Section = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title6)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 12px;
`;

export const Subtitle = styled.h3`
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 16px 0 8px;
`;

export const Paragraph = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p6)};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: 8px;
`;

export const List = styled.ul`
  list-style: disc;
  padding-left: 20px;
  margin-bottom: 8px;
`;

export const ListItem = styled.li`
  ${({ theme }) => setTypography(theme.typography.paragraph.p6)};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: 6px;
`;

export const Dates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[300]};

  ${({ theme }) => setTypography(theme.typography.paragraph.p7)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;
