import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { setTypography } from '@/styles/theme/typography';

/** 모바일·웹뷰는 상단바에 뒤로가기가 있어 데스크톱에서만 보인다 */
export const BackLink = styled(Link)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.base.black};
  }

  /* 오른쪽 셰브론을 돌려 '자세히 보기'와 같은 아이콘을 쓴다 */
  svg {
    width: 6px;
    height: 10px;
    transform: rotate(180deg);
  }

  ${media.tablet} {
    display: none;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;

  ${media.mobile} {
    padding-bottom: 28px;
  }
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.title.title3)};
  }
`;

export const Summary = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[800]};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[300]};

  ${media.mobile} {
    gap: 12px;
    padding: 24px 0;
  }
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  color: ${({ theme }) => theme.colors.base.black};

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.etc.bold18)};
  }
`;

export const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
`;

export const Item = styled.li`
  position: relative;
  padding-left: 16px;
  ${({ theme }) => setTypography(theme.typography.paragraph.p4)};
  color: ${({ theme }) => theme.colors.gray[900]};

  &::before {
    content: '';
    position: absolute;
    top: 9px;
    left: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary[900]};
  }

  ${media.mobile} {
    ${({ theme }) => setTypography(theme.typography.paragraph.p6r)};

    &::before {
      top: 8px;
    }
  }
`;
