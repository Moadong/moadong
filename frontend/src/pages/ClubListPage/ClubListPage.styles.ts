import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';

export const PageContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding-top: ${HEADER_HEIGHT.desktop}px;

  ${media.laptop} {
    padding-left: 20px;
    padding-right: 20px;
  }

  ${media.tablet} {
    padding-top: ${HEADER_HEIGHT.tablet}px;
  }

  ${media.mobile} {
    padding-top: ${HEADER_HEIGHT.mobile}px;
  }

  ${media.mini_mobile} {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  margin-bottom: 60px;
`;

export const SectionBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin: 24px 0px 16px 8px;

  ${media.mobile} {
    margin: 12px 4px 12px;
  }

  /* 카테고리 줄이 mini_mobile에서 음수 마진으로 겹쳐 오는 만큼 밀어준다 */
  ${media.mini_mobile} {
    margin-top: 22px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #787878;

  ${media.mobile} {
    font-size: 14px;
  }
`;

export const TotalCountResult = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #787878;

  ${media.mobile} {
    font-size: 12px;
  }
`;

export const CardList = styled.div`
  display: grid;
  width: 100%;
  max-width: 100%;
  gap: 20px;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  ${media.laptop} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (max-width: 500px) {
    gap: 6px;
    margin-top: 16px;
  }
`;

export const EmptyResult = styled.div`
  padding: 80px 20px;
  text-align: center;
  color: #555;
  font-size: 1.125rem;
  line-height: 1.6;
  white-space: pre-line;

  ${media.mobile} {
    font-size: 0.95rem;
  }
`;

export const RetryButton = styled.button`
  margin-top: 24px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: ${({ theme }) => theme.colors.primary[900]};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[800]};
    box-shadow: 0 4px 12px rgba(255, 84, 20, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  ${media.mobile} {
    padding: 10px 24px;
    font-size: 14px;
  }
`;
