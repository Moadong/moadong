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

/**
 * url() 값이 문자열을 빠져나가 CSS를 덧붙이지 못하게 막는다.
 * 큰따옴표로 감싸므로 따옴표·역슬래시·줄바꿈만 인코딩하면 된다.
 * 지금은 백엔드가 파일명을 [A-Za-z0-9._-]로 치환해 이 문자들이 오지 않지만,
 * 그 불변식이 깨져도 여기서 막히게 둔다.
 */
const toCssUrl = (src: string) =>
  `url("${src.replace(/["\\\n\r]/g, encodeURIComponent)}")`;

/** 이미지가 없는 글은 호출부가 기본 커버를 넘긴다 */
export const Image = styled.div<{ $imageUrl: string }>`
  width: 100%;
  height: 100%;

  background-color: #ddd;
  background-image: ${({ $imageUrl }) => toCssUrl($imageUrl)};
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
