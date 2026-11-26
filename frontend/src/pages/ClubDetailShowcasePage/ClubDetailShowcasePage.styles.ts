// 상세페이지 시안 공유용 목록 페이지 스타일
import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

export const Page = styled.main`
  max-width: 880px;
  margin: 0 auto;
  padding: ${HEADER_HEIGHT.desktop + 40}px 20px 80px;

  ${media.tablet} {
    padding: 32px 20px 60px;
  }
`;

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
`;

export const Badge = styled.span`
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: ${colors.primary[500]};
  color: ${colors.primary[900]};
  ${setTypography(typography.button.button2)};
`;

export const Title = styled.h1`
  ${setTypography(typography.title.title2)};
  color: ${colors.base.black};

  ${media.tablet} {
    ${setTypography(typography.title.title3)};
  }
`;

export const Lead = styled.p`
  ${setTypography(typography.paragraph.p4)};
  line-height: 165%;
  color: ${colors.gray[800]};
  word-break: keep-all;
`;

export const Notice = styled.p`
  padding: 14px 16px;
  border-radius: 14px;
  background-color: ${colors.gray[100]};
  ${setTypography(typography.paragraph.p6)};
  line-height: 165%;
  color: ${colors.gray[800]};
  word-break: keep-all;

  strong {
    color: ${colors.primary[900]};
  }
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Category = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CategoryTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};
`;

export const ClubGrid = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const ClubCard = styled.li`
  a {
    display: flex;
    flex-direction: column;
    gap: 4px;
    height: 100%;
    padding: 18px;
    border: 1px solid ${colors.gray[300]};
    border-radius: 16px;
    text-decoration: none;
    transition:
      border-color ${transitions.duration.fast} ${transitions.easing.ease},
      transform ${transitions.duration.fast} ${transitions.easing.ease};
  }

  a:hover {
    border-color: ${colors.primary[700]};
    transform: translateY(-2px);
  }
`;

export const ClubName = styled.span`
  ${setTypography(typography.title.title6)};
  color: ${colors.base.black};
`;

export const ClubSummary = styled.span`
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[700]};
`;

export const Go = styled.span`
  margin-top: 8px;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.primary[900]};
`;
