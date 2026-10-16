import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

/** 시트 본문 gap(14px)에 더해 제목 위 여백이 62px가 되도록 한다 */
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 48px;
`;

export const Heading = styled.h3`
  margin: 0;
  color: ${colors.base.black};
  ${setTypography(typography.title.title5)};
`;

export const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
