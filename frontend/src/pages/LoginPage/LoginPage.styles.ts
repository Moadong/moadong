import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${HEADER_HEIGHT.desktop}px;
  min-height: calc(100vh - ${HEADER_HEIGHT.desktop}px);
  background: ${colors.base.white};
  padding-bottom: 6vh;

  ${media.mobile} {
    align-items: flex-start;
    margin-top: ${HEADER_HEIGHT.mobile}px;
    /* height 고정 + overflow hidden → 스크롤 완전히 제거 */
    height: calc(100vh - ${HEADER_HEIGHT.mobile}px);
    overflow: hidden;
    padding-bottom: 0;
  }
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
  max-width: 600px;
  padding: 0 48px;

  ${media.mobile} {
    width: 100%;
    max-width: none;
    padding: 0 20px 46px;
    /* 아이템을 하단부터 쌓음 → 넘치면 상단(로고)이 클리핑됨 */
    height: 100%;
    justify-content: flex-end;
    overflow: hidden;
  }
`;

export const LogoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: clamp(24px, 6vh, 72px);

  ${media.mobile} {
    margin-bottom: 0;
    flex-shrink: 0;
    gap: 4px;
  }
`;

/**
 * 모바일 전용: 로고 위 최소 여백 확보용 spacer.
 * flex-shrink: 0 → 절대 줄어들지 않음.
 * justify-content: flex-end의 free space가 0이 된 뒤에도
 * 이 높이만큼은 로고 위 여백이 유지됨.
 * 이후 MiddleSpacer가 먼저 줄고, 그다음 이 spacer가 클리핑됨.
 */
export const TopSpacer = styled.div`
  display: none;

  ${media.mobile} {
    display: block;
    flex-shrink: 0;
    height: 80px;
    width: 100%;
  }
`;

/**
 * 모바일 전용: 로고~말풍선 사이 간격.
 * flex-shrink: 1 → TopSpacer free space가 소진된 뒤 이 간격이 줄어들고,
 * min-height에 닿으면 그때부터 로고가 상단 클리핑됨.
 */
export const MiddleSpacer = styled.div`
  display: none;

  ${media.mobile} {
    display: block;
    flex: 0 1 168px;
    min-height: 32px;
    width: 100%;
  }
`;

export const Logo = styled.img`
  width: 200px;
  height: auto;
  object-fit: contain;

  ${media.mobile} {
    width: 259px;
    height: 55px;
  }
`;

export const Subtitle = styled.p`
  ${setTypography(typography.etc.bold18)}
  color: ${colors.gray[900]};
  text-align: center;
  margin: 0;

  ${media.mobile} {
    max-width: 238px;
    margin: 4px 0 0 0;
  }
`;

export const TooltipWrapper = styled.div`
  width: 100%;
  max-width: 260px;
  margin-bottom: clamp(8px, 2vh, 16px);

  ${media.mobile} {
    flex-shrink: 0;
    width: 77%;
    max-width: 252px;
    margin-bottom: 20px;
  }
`;

export const TooltipPill = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  background: ${colors.base.white};
  border: 1px solid ${colors.gray[300]};
  border-radius: 100px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  ${setTypography(typography.etc.medium12)}
  color: ${colors.base.black};
  position: relative;
  white-space: nowrap;

  ${media.mobile} {
    /* 좁은 화면에서 줄바꿈 방지: vw 기준으로 폰트 축소 */
    font-size: clamp(9px, 3.2vw, 12px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: ${colors.base.white};
    border-right: 1px solid ${colors.gray[300]};
    border-bottom: 1px solid ${colors.gray[300]};
  }
`;

export const ButtonList = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: clamp(4px, 1.5vh, 12px);

  ${media.mobile} {
    flex-shrink: 0;
    width: 100%;
    max-width: 400px;
    margin-top: 0;
  }
`;

export const SignUpText = styled.span`
  ${setTypography(typography.etc.medium12)}
  color: ${colors.base.black};
  margin-top: 20px;

  ${media.mobile} {
    flex-shrink: 0;
    margin-top: 20px;
  }
`;
