import styled from 'styled-components';
import RightArrowIcon from '@/assets/images/icons/right_arrow_icon.svg?react';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 14px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${colors.gray[50]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 14px;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const YearRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  align-self: stretch;
`;

export const YearText = styled.span`
  ${setTypography(typography.paragraph.p5)}
  letter-spacing: -0.02em;
  color: ${colors.base.black};
`;

export const ChevronIcon = styled(RightArrowIcon)`
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  path {
    stroke: ${colors.gray[800]};
  }
`;

export const DividerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0;
  align-self: stretch;
`;

export const Divider = styled.div`
  width: 100%;
  height: 0;
  border: 1px solid ${colors.gray[300]};
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  align-self: stretch;
  gap: 4px;
`;

export const TitleArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const ActiveDot = styled.span`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${colors.primary[900]};
`;

export const Title = styled.span<{ $active: boolean }>`
  ${setTypography(typography.paragraph.p2)}
  letter-spacing: -0.02em;
  color: ${({ $active }) => ($active ? colors.primary[900] : colors.gray[800])};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MoreButtonContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;

  &:hover {
    background-color: ${colors.gray[400]};
  }
`;

export const DateText = styled.span`
  ${setTypography(typography.etc.medium12)}
  letter-spacing: -0.02em;
  color: ${colors.gray[600]};
  align-self: stretch;
`;
