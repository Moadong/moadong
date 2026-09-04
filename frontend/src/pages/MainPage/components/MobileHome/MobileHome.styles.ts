import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';

/** 고정된 홈 상단바가 배너를 가리지 않도록 밀어주는 자리 */
export const HeaderSpacer = styled.div`
  height: ${HEADER_HEIGHT.mobile}px;
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
