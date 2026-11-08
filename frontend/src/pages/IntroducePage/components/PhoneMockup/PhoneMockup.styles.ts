// 은색 아이폰 목업의 테두리·옆 버튼·상태바·다이내믹 아일랜드와 아래쪽 흐림 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

const PHONE_WIDTH = 320;
const STATUS_BAR_HEIGHT = 50;

/* 폰 아래쪽이 배경으로 자연스럽게 사라지게 한다. zoomed면 폰을 크게 키우고 위쪽만 보여준다 */
export const Fade = styled.div<{ $zoomed: boolean }>`
  position: relative;
  width: ${({ $zoomed }) => ($zoomed ? 400 : PHONE_WIDTH)}px;
  max-height: ${({ $zoomed }) => ($zoomed ? 430 : 600)}px;
  overflow: hidden;
  padding: 0 4px;
  mask-image: linear-gradient(180deg, black 68%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, black 68%, transparent 100%);

  ${media.tablet} {
    width: ${({ $zoomed }) => ($zoomed ? 320 : 270)}px;
    max-height: ${({ $zoomed }) => ($zoomed ? 360 : 500)}px;
  }

  ${media.mobile} {
    width: ${({ $zoomed }) => ($zoomed ? 300 : 250)}px;
    max-height: ${({ $zoomed }) => ($zoomed ? 340 : 460)}px;
  }
`;

/* 은색 프레임: 바깥 밝은 금속 + 안쪽 얇은 검은 베젤 */
export const Body = styled.div`
  position: relative;
  padding: 10px;
  border-radius: 54px;
  background: linear-gradient(
    150deg,
    ${colors.gray[50]} 0%,
    ${colors.gray[300]} 45%,
    ${colors.gray[200]} 100%
  );
  box-shadow:
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.9),
    inset 0 0 0 3px ${colors.gray[400]},
    0 30px 60px rgba(17, 17, 17, 0.12);

  ${media.tablet} {
    padding: 8px;
    border-radius: 46px;
  }
`;

export const SideButton = styled.span<{
  $side: 'left' | 'right';
  $top: number;
  $height: number;
}>`
  position: absolute;
  ${({ $side }) => $side}: -3px;
  top: ${({ $top }) => $top}px;
  width: 4px;
  height: ${({ $height }) => $height}px;
  border-radius: 2px;
  background: ${colors.gray[400]};
`;

export const Screen = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 44px;
  background: ${colors.base.white};
  box-shadow: 0 0 0 4px ${colors.gray[950]};

  ${media.tablet} {
    border-radius: 38px;
  }
`;

/* 세이프 에어리어: 시간·아일랜드·배터리가 있는 상단 띠 */
export const StatusBar = styled.div<{
  $tone: 'dark' | 'light';
  $overlay: boolean;
}>`
  position: ${({ $overlay }) => ($overlay ? 'absolute' : 'relative')};
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${STATUS_BAR_HEIGHT}px;
  padding: 4px 26px 0 32px;
  color: ${({ $tone }) =>
    $tone === 'light' ? colors.base.white : colors.base.black};

  ${media.tablet} {
    height: 42px;
    padding: 2px 20px 0 26px;
  }
`;

export const Time = styled.span`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;

  ${media.tablet} {
    font-size: 13px;
  }
`;

export const Island = styled.span`
  position: absolute;
  top: 11px;
  left: 50%;
  width: 96px;
  height: 28px;
  border-radius: 999px;
  background: ${colors.gray[950]};
  transform: translateX(-50%);

  ${media.tablet} {
    top: 9px;
    width: 80px;
    height: 24px;
  }
`;

export const StatusIcons = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;

  ${media.tablet} {
    gap: 4px;
    transform: scale(0.88);
    transform-origin: right center;
  }
`;

/* 캡처 이미지를 화면 폭에 맞춰 넣는다 */
export const Capture = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

/* 긴 캡처가 스크롤되는 창 */
export const ScrollViewport = styled.div`
  overflow: hidden;
`;
