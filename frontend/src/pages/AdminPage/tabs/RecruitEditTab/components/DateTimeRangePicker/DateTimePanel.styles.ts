import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Panel = styled.div`
  position: absolute;
  top: 55px;
  left: 0;

  display: flex;
  background: ${colors.base.white};
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  overflow: hidden;
`;
