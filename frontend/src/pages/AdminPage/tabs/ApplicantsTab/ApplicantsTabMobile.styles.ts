import styled from 'styled-components';
import checkIcon from '@/assets/images/icons/checkBox.svg';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
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
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px 0px;
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0 10px 20px;
  margin-top: 12px;
  border-top: 4px solid ${colors.gray[200]};
`;

export const FilterPillsWrapper = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const ControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid ${colors.gray[200]};
  border-bottom: 1px solid ${colors.gray[200]};
`;

export const AllSelectArea = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

export const AllCheckbox = styled.div<{ $checked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid ${colors.gray[400]};
  background-color: ${colors.base.white};
  flex-shrink: 0;

  ${({ $checked }) =>
    $checked &&
    `
    border: 0;
    background: url("${checkIcon}") center/24px 24px no-repeat;
  `}
`;

export const AllSelectLabel = styled.span`
  ${setTypography(typography.paragraph.p5)}
  color: ${colors.gray[700]};
`;

export const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px 0px;
`;

export const ListTitle = styled.span`
  ${setTypography(typography.title.title5)}
  color: ${colors.base.black};
  align-self: stretch;
`;

export const List = styled.div``;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 36px 20px;
`;

export const EmptyLabel = styled.span`
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[900]};
`;
