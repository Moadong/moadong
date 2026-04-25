import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageContainer = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 80px;

  ${media.mobile} {
    padding: 32px 16px 60px;
  }
`;

export const Blob = styled.div<{
  $size: number;
  $top: string;
  $left: string;
  $color: string;
}>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  background: ${({ $color }) => $color};
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1400px;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 4px;

  ${media.mobile} {
    font-size: 1.4rem;
  }
`;

export const PageDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 4px;
`;

export const DesktopOnly = styled.div`
  position: absolute;
  right: 0;
  top: 0;

  ${media.tablet} {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;
  width: 100%;
  margin-top: 32px;

  ${media.tablet} {
    display: block;
  }
`;

export const TopRow = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 16px;

  & > *:first-child {
    text-align: center;
  }

  ${media.tablet} {
    margin-bottom: 32px;
  }
`;
