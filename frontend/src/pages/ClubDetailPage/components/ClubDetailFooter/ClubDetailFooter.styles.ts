import { Z_INDEX } from '@/styles/zIndex';
import styled from 'styled-components';

export const ClubDetailFooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: ${Z_INDEX.sticky};
  padding: 10px 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  background-color: white;
  border-top: 1px solid #cdcdcd;
`;
