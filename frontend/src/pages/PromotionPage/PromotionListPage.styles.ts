import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div<{ $isWebview?: boolean }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-top: ${({ $isWebview }) => ($isWebview ? '0' : '92px')};

  ${media.mobile} {
    padding-top: 0;
  }
`;

export const Wrapper = styled.div`
  margin-top: 16px;
  padding: 0px 50px 90px;

  ${media.laptop} {
    padding: 0px 20px 90px;
  }

  @media (max-width: 955px) {
    padding: 0px 20px 90px;
  }

  ${media.mobile} {
    padding: 0px 20px 90px;
  }
`;

export const SearchBarArea = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 8px;

  & > div:last-child {
    flex: 1;
    max-width: none;
  }
`;

export const LogoImage = styled.img`
  flex-shrink: 0;
  height: 24px;
  width: auto;
`;

export const EmptyText = styled.p`
  text-align: center;
  font-size: 16px;
  color: ${colors.gray[700]};
  padding: 120px 0;
`;
