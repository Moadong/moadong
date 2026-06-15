import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  ${media.tablet} {
    padding-bottom: 60px;
  }
`;

export const AppSpacer = styled.div`
  height: calc(71px + env(safe-area-inset-bottom));

  ${media.tablet} {
    height: calc(87px + env(safe-area-inset-bottom));
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
  flex-shrink: 0;
  width: 400px;

  ${media.tablet} {
    width: 100%;
    gap: 0px;
  }
`;

export const MapInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${media.tablet} {
    display: none;
  }
`;

export const MapCard = styled.button`
  padding: 0;
  font: inherit;
  width: 100%;
  height: 189px;

  border-radius: 20px;
  border: 1px solid ${colors.gray[400]};
  overflow: hidden;
  cursor: pointer;

  background-color: #f2f2f2;

  * {
    cursor: pointer !important;
  }
`;

export const MapDetailText = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  padding: 0 2px;

  font-size: 14px;
  color: ${colors.gray[700]};
  cursor: default;
  user-select: none;

  svg {
    width: 18px;
    height: 18px;
    margin: 1px 2px 1px 0px;
    color: ${colors.gray[500]};
  }
`;

export const RightSection = styled.div`
  width: 100%;

  ${media.tablet} {
    border-top: 6px solid ${colors.gray[200]};
    padding-top: 12px;
  }
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
