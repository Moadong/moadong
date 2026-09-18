import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: ${colors.base.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
`;

/** 이미지가 없는 글은 호출부가 기본 커버를 넘긴다. url()은 따옴표로 감싼다 */
export const Image = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;

  background-color: #ddd;
  background-image: url('${({ $imageUrl }) => $imageUrl}');
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
  padding: 14px;

  ${media.mini_mobile} {
    padding: 10px;
  }
`;
