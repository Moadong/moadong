import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { transitions } from '@/styles/theme/transitions';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  ${media.tablet} {
    padding-bottom: 60px;
  }
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 360px;
  flex-shrink: 0;

  ${media.tablet} {
    width: 100%;
  }
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 189px;
  border-radius: 20px;
  border: 1px solid ${colors.gray[400]};
  overflow: hidden;
  background-color: #f2f2f2;

  ${media.tablet} {
    padding: 0 20px;
  }
`;

export const RightSection = styled.div`
  width: 100%;
`;

export const TabContent = styled.div`
  animation: fadeIn ${transitions.duration.normal}
    ${transitions.easing.easeInOut};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
