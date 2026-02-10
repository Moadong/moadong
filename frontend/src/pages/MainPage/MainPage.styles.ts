import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.mobile} {
    padding: 0 20px;
  }

  ${media.mini_mobile} {
    padding: 0 10px;
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
`;

export const SectionTabs = styled.nav`
  display: flex;
  gap: 18px;

  ${media.mobile} {
    gap: 16px;
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  display: flex;
  position: relative;
  font-size: 24px;
  font-weight: bold;
  color: ${({ $active }) => ($active ? '#787878' : '#DCDCDC')};
  border: none;
  background: none;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 1.5px;
    background: #787878;
    border-radius: 1.5px;
    transform: ${({ $active }) => ($active ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: center;
    transition: transform 0.2s ease;
  }

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
  transition:
    gap 0.5s ease,
    grid-template-columns 0.5s ease;

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
