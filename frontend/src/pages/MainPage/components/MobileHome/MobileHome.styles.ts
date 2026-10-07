import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';

/**
 * 고정 헤더가 배너를 가리지 않도록 밀어주는 자리.
 * 앱 웹뷰는 폭이 넓어도 이 홈을 쓰는데, 그 폭에서는 배너가 자체 margin-top으로
 * 헤더를 피하므로 모바일에서만 켠다(`MainContent`의 `HeaderSpacer`와 같다).
 */
export const HeaderSpacer = styled.div`
  display: none;

  ${media.mobile} {
    display: block;
    height: ${HEADER_HEIGHT.mobile}px;
  }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 16px 20px 40px;

  ${media.mini_mobile} {
    padding: 16px 10px 40px;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  letter-spacing: -0.4px;
  line-height: 1.4;
`;

export const CardList = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 6px;
`;
