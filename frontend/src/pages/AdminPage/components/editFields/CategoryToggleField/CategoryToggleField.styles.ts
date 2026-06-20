import styled from 'styled-components';
import { TAG_COLORS } from '@/styles/clubTags';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 5px;
  width: 100%;
`;

export const OptionButton = styled.button<{
  $category: string;
  $selected: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ $category, $selected }) =>
    $selected ? (TAG_COLORS[$category] ?? colors.gray[200]) : colors.gray[200]};

  ${setTypography(typography.button.button2)}
  line-height: 140%;
  color: ${colors.gray[800]};
`;
