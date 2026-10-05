import styled from 'styled-components';
import { HEADER_HEIGHT } from '@/components/common/Header/Header.styles';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${HEADER_HEIGHT.desktop}px;
  min-height: calc(100vh - ${HEADER_HEIGHT.desktop}px);
  background: ${colors.base.white};
  padding-bottom: 12vh;

  ${media.tablet} {
    align-items: flex-start;
    margin-top: ${HEADER_HEIGHT.tablet}px;
    height: calc(100dvh - ${HEADER_HEIGHT.tablet}px);
    overflow: hidden;
    padding-bottom: 0;
  }

  ${media.mobile} {
    margin-top: ${HEADER_HEIGHT.mobile}px;
    height: calc(100dvh - ${HEADER_HEIGHT.mobile}px);
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

  ${media.tablet} {
    width: 100%;
    max-width: none;
    padding: 0 20px calc(46px + env(safe-area-inset-bottom));
    height: 100%;
    justify-content: flex-start;
    overflow-y: auto;
  }
`;

export const LogoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: clamp(20px, 4vh, 56px);

  ${media.tablet} {
    margin-top: auto;
    margin-bottom: 40px;
    flex-shrink: 0;
    gap: 4px;
  }
`;

export const Logo = styled.img`
  width: 200px;
  height: auto;
  object-fit: contain;

  ${media.tablet} {
    width: 259px;
    height: 55px;
  }
`;

export const Subtitle = styled.p`
  ${setTypography(typography.etc.bold18)}
  color: ${colors.gray[900]};
  text-align: center;
  margin: 0;

  ${media.tablet} {
    margin: 4px 0 0 0;
    white-space: nowrap;
  }
`;

/**
 * 데스크탑 전용 카드 박스 (네이버 로그인 참고).
 * 태블릿 이하에서는 display:contents로 박스가 사라지고
 * 자식 요소들이 Page의 flex 아이템으로 직접 참여함.
 */
export const LoginBox = styled.div`
  width: 100%;
  max-width: 480px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 16px;
  padding: 40px 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.tablet} {
    display: contents;
  }
`;

export const TooltipWrapper = styled.div`
  width: 100%;
  max-width: 260px;
  margin-bottom: clamp(8px, 2vh, 16px);

  ${media.tablet} {
    flex-shrink: 0;
    width: 77%;
    max-width: 252px;
    margin-top: auto;
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

  ${media.tablet} {
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

  ${media.tablet} {
    flex-shrink: 0;
    margin-top: 0;
    width: 100%;
    max-width: 460px;
  }
`;

export const AdminLoginText = styled.span`
  ${setTypography(typography.etc.medium12)}
  color: ${colors.base.black};
  margin-top: 20px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  ${media.tablet} {
    flex-shrink: 0;
  }
`;
