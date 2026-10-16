import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  width: 100%;
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
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
  gap: 10px;
  padding: 20px;
`;
