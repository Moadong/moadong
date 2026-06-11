import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Container = styled.div`
  flex: 1;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding-top: ${HEADER_HEIGHT.desktop}px;
`;

export const NavWrapper = styled.div`
  position: sticky;
  top: ${HEADER_HEIGHT.desktop}px;
  z-index: 10;
  background: white;
  margin-bottom: 16px;

  ${media.tablet} {
    top: ${HEADER_HEIGHT.tablet}px;
  }

  ${media.mobile} {
    top: ${HEADER_HEIGHT.mobile}px;
  }
`;

export const TimetableSection = styled.section`
  width: 100%;
  max-width: 500px;
  margin: 0 auto 20px;
`;

export const TimetableHeader = styled.div`
  margin: 10px 20px 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff7f3;
  border: 1px solid #ffe0d4;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TimetableDate = styled.p`
  margin: 0;
  color: #3a3a3a;
  font-size: 14px;
  font-weight: 700;
`;

export const TimetableLocation = styled.p`
  margin: 0;
  color: #7a7a7a;
  font-size: 12px;
  font-weight: 600;
`;

export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 20px 12px;
  color: #7a7a7a;
  font-size: 12px;
  font-weight: 600;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e8e8e8;
  }
`;
