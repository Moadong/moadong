import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fff;
`;

export const ContentWrapper = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  margin-top: 100px;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    flex-direction: column;
    padding: 0;
    gap: 0;
    max-width: 100%;
    margin-top: 0;
  }
`;

export const LeftSection = styled.div`
  width: 420px;

  ${media.tablet} {
    width: 100%;
  }
`;

export const RightSection = styled.div`
  flex: 1;
`;

export const Message = styled.p`
  padding: 40px 18px;
  text-align: center;
`;