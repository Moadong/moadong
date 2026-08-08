import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 15px 10px;
  border-radius: 12px;
  background: ${colors.base.white};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.h4`
  margin: 0;
  padding-left: 4px;
  letter-spacing: -0.32px;
  color: ${colors.base.black};
  ${setTypography(typography.paragraph.p2)};
`;

export const DescriptionRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px;
`;

export const Description = styled.p`
  margin: 0;
  max-width: 126px;
  letter-spacing: -0.24px;
  color: ${colors.gray[700]};
  ${setTypography(typography.button.button2)};
`;

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 217px;
  padding: 0 4px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: ${colors.gray[500]};
  }
`;
