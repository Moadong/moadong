import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const CategoryButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 32px;

  ${media.mobile} {
    background-color: white;
    position: sticky;
    top: 56px;
    z-index: 1;

    margin: 0px -20px;
    padding: 6px 20px 12px;
  }

  ${media.mini_mobile} {
    margin: -10px -10px;
    padding: 16px 10px 12px;
  }
`;

export const CategoryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 10px 0px;
  transition: transform 0.1s ease;

  ${media.mobile} {
    padding: 0px;
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 56px;
    height: 56px;
    transition: transform 0.2s ease;

    ${media.mobile} {
      width: 45px;
      height: 45px;
    }
    ${media.mini_mobile} {
      width: 40px;
      height: 40px;
    }
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #787878;
    margin-top: 8px;
    line-height: 17px;
    white-space: nowrap;

    ${media.tablet} {
      font-size: 14px;
      margin-top: 10px;
    }

    ${media.mobile} {
      font-size: 12px;
      margin-top: 4px;
      line-height: normal;
    }

    ${media.mini_mobile} {
      font-size: 10px;
      margin-top: 2px;
      line-height: normal;
    }
  }
`;
