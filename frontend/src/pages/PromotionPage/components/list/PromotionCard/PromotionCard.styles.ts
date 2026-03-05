import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  width: 226px;
  border-radius: 14px;
  overflow: hidden;
  background: ${colors.base.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  ${media.mobile} {
    width: 200px;
  }
  
  ${media.mini_mobile} {
    width: 164px;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 164px;
`;

export const Image = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 100%;

  background-color: #ddd;
  background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl})` : 'none')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const DdayWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
`;

export const Content = styled.div`
  padding: 10px;
`;

export const TagWrapper = styled.div`
  margin-top: 4px;
`;
