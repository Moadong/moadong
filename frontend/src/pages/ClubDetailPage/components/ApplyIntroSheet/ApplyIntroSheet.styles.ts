// 지원 안내 시트의 정보 행·과정 블록 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 440px;
  padding: 28px 24px 24px;

  ${media.tablet} {
    max-width: none;
    padding: 8px 20px calc(20px + env(safe-area-inset-bottom));
  }

  button {
    height: 52px;
    border-radius: 14px;
  }
`;

export const Title = styled.h2`
  ${setTypography(typography.title.title4)};
  color: ${colors.base.black};

  ${media.tablet} {
    ${setTypography(typography.title.title5)};
  }
`;

export const InfoList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 16px;
  border-radius: 14px;
  background-color: ${colors.gray[100]};
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 8px;
  ${setTypography(typography.paragraph.p5)};
  word-break: keep-all;

  dt {
    font-weight: 700;
    color: ${colors.gray[700]};
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: ${colors.gray[950]};

    span {
      font-weight: 500;
      color: ${colors.gray[700]};
    }
  }
`;

export const StepsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SubTitle = styled.h3`
  ${setTypography(typography.title.title6)};
  color: ${colors.gray[900]};
`;
