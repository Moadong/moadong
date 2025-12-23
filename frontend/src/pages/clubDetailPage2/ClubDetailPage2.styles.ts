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
  border-bottom: 1px solid ${colors.gray[300]};
  padding: 0 20px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? colors.base.black : colors.gray[600])};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? colors.base.black : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${colors.base.black};
  }
`;

export const TabContent = styled.div`
  padding: 20px;
`;
