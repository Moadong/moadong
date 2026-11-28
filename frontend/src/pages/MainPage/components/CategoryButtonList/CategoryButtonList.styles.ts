import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

const CHIP_HEIGHT = 36;
const CHIP_BAR_PADDING_Y = 6;
const CHIP_BAR_BORDER = 1;

/** 모바일 고정 칩 줄의 높이. 목록 앵커의 scroll-margin-top이 이 값만큼 더 띄운다 */
export const STUCK_CHIP_BAR_HEIGHT =
  CHIP_HEIGHT + CHIP_BAR_PADDING_Y * 2 + CHIP_BAR_BORDER;

export const CategoryButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-top: 24px;

  ${media.mobile} {
    margin: 0px -20px;
    padding: 12px 20px 8px;
  }

  ${media.mini_mobile} {
    margin: 0px -10px;
    padding: 12px 10px 8px;
  }
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
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
    color: ${colors.gray[800]};
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
      font-weight: 600;
    }

    ${media.mini_mobile} {
      font-size: 10px;
      margin-top: 2px;
      line-height: normal;
    }

    ${({ $active }) =>
      $active &&
      `
      color: ${colors.gray[950]};
      font-weight: 700;

      ${media.mobile} {
        font-weight: 700;
      }
    `}
  }
`;

/** 아이콘 줄이 헤더 아래로 사라졌을 때만 렌더하는 모바일 전용 고정 칩 줄 */
export const StuckChipBar = styled.div`
  display: none;

  ${media.mobile} {
    position: fixed;
    top: ${HEADER_HEIGHT.mobile}px;
    left: 0;
    right: 0;
    z-index: ${Z_INDEX.header - 1};

    display: flex;
    align-items: center;
    gap: 4px;
    box-sizing: border-box;
    height: ${STUCK_CHIP_BAR_HEIGHT}px;
    padding: 0 20px;
    overflow-x: auto;
    background-color: ${colors.base.white};
    border-bottom: ${CHIP_BAR_BORDER}px solid ${colors.gray[300]};

    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  ${media.mini_mobile} {
    padding: 0 10px;
  }
`;

export const Chip = styled.button<{ $active: boolean }>`
  flex: 1 0 auto;
  height: ${CHIP_HEIGHT}px;
  padding: 0 8px;
  border: none;
  border-radius: ${CHIP_HEIGHT / 2}px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${({ $active }) =>
    $active ? colors.gray[900] : colors.gray[100]};
  color: ${({ $active }) => ($active ? colors.base.white : colors.gray[800])};
`;
