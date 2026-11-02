import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding-top: 92px;

  ${media.mobile} {
    padding-top: 70px;
  }
`;

export const TabWrapper = styled.div<{ $webview?: boolean }>`
  display: flex;
  justify-content: center;
  padding-top: ${({ $webview }) => ($webview ? '12px' : '0')};
  margin-bottom: 16px;

  ${media.mobile} {
    display: block;

    button {
      width: 167px;
    }
  }

  button {
    width: 250px;
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
  border: 1px solid ${colors.primary[600]};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TimetableDate = styled.p`
  margin: 0;
  color: ${colors.gray[900]};
  font-size: 14px;
  font-weight: 700;
`;

export const TimetableLocation = styled.p`
  margin: 0;
  color: ${colors.gray[700]};
  font-size: 12px;
  font-weight: 600;
`;
