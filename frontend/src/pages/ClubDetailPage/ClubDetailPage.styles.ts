import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
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

export const RightSection = styled.div`
  width: 100%;
`;

export const TabList = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${colors.gray[200]};

  ${media.tablet} {
    padding-left: 20px;
  }

  ${media.mobile} {
    justify-content: center;
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 700;
  width: 167px;
  padding-bottom: 4px;
  color: ${({ $active }) => ($active ? colors.gray[800] : colors.gray[400])};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? colors.gray[800] : colors.gray[400])};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${colors.gray[800]};
    border-bottom: 2px solid ${colors.gray[800]};
  }
`;

export const TabContent = styled.div``;
