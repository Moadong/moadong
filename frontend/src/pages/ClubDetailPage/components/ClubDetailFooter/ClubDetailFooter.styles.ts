import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const ClubDetailFooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 10px 0px 24px 0px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  background-color: white;
  border-top: 1px solid #cdcdcd;

  ${media.mobile} {
    padding: 10px 0px 16px 0px;
  }
`;
