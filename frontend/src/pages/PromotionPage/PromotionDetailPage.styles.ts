import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const DesktopHeader = styled.div`
  display: block;

  ${media.tablet} {
    display: none;
  }
`;

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fff;
`;

export const MobileTopBar = styled.div`
  display: none;

  ${media.tablet} {
    display: block;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: ${colors.base.white};
  }
`;

export const TitleWrapper = styled.div`
  max-width: 1180px;
  margin: 40px auto 0 auto;
  padding: 0 20px;

  ${media.tablet} {
    display: none;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1180px;
  width: 100%;
  margin: 20px auto;

  display: flex;
  gap: 40px;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.tablet} {
    flex-direction: column;
    gap: 0;
    padding: 0;
  }
`;

export const LeftSection = styled.div`
  width: 420px;

  ${media.tablet} {
    width: 100%;
    order: 2;
  }
`;

export const RightSection = styled.div`
  flex: 1;
`;

export const Message = styled.p`
  padding: 40px 18px;
  text-align: center;
`;
