import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.section`
  padding-top: 20px;

  ${media.tablet} {
    padding: 16px 20px 0px 20px;
  }
`;

export const MapCard = styled.div`
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

export const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 2px 0;
  font-size: 14px;
  color: ${colors.gray[700]};

  img {
    width: 12px;
    height: 15px;
  }

  ${media.tablet} {
    padding: 6px 2px 0;
  }
`;
