import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

const MoreButton = styled.button`
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

export default MoreButton;
