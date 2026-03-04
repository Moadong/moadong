import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  border-radius: 14px;
  overflow: hidden;
  background: ${colors.base.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 164px; // 수정 예정
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
