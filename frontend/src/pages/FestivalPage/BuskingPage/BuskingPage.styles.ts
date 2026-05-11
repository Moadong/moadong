import { media } from '@/styles/mediaQuery';
import styled from 'styled-components';

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
  padding-top: 92px;

  ${media.mobile} {
    padding-top: 0;
  }
`;

export const NavWrapper = styled.div`
  margin-bottom: 16px;
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
