import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

const AddItemButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  gap: 6px;
  background: ${colors.primary[800]};
  border: none;
  border-radius: 14px;
  cursor: pointer;
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};

  img {
    width: 16px;
    height: 16px;
  }
`;

export default AddItemButton;
