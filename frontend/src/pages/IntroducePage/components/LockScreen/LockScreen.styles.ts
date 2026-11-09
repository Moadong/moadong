// 잠금화면 바탕(연한 파스텔 그라데이션), 큰 시계, 리퀴드 글래스 알림 카드 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

/* 높이를 고정해 알림이 생기고 사라져도 화면 크기가 변하지 않는다 */
export const Wallpaper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 560px;
  padding: 62px 14px 0;
  overflow: hidden;
  /* 연한 파스텔 바탕: 알림 유리와 글씨가 묻히지 않게 채도를 낮춘다 */
  background:
    radial-gradient(
      110% 70% at 15% 5%,
      ${colors.primary[700]} 0%,
      transparent 60%
    ),
    radial-gradient(
      90% 60% at 95% 40%,
      ${colors.secondary[6].main} 0%,
      transparent 55%
    ),
    radial-gradient(
      100% 70% at 30% 100%,
      ${colors.secondary[4].main} 0%,
      transparent 60%
    ),
    ${colors.primary[600]};
  color: ${colors.gray[950]};

  ${media.tablet} {
    height: 480px;
    padding-top: 54px;
  }
`;

export const DateText = styled.p`
  font-size: 17px;
  font-weight: 600;
  color: ${colors.gray[800]};

  ${media.tablet} {
    font-size: 14px;
  }
`;

/* 리퀴드 글래스 시계: 아래로 갈수록 옅어지는 반투명 글자 */
export const Clock = styled.p`
  font-size: 92px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(
    180deg,
    ${colors.gray[900]} 0%,
    rgba(58, 58, 58, 0.5) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;

  ${media.tablet} {
    font-size: 70px;
  }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 30px;

  ${media.tablet} {
    margin-top: 22px;
  }
`;

/* 리퀴드 글래스 알림: 뒤가 비치는 밝은 반투명 유리, 위 테두리에 빛이 맺힌다 */
export const Notification = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3),
    0 12px 32px rgba(17, 17, 17, 0.14);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  color: ${colors.gray[950]};
`;

export const AppIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: ${colors.base.white};

  img {
    width: 24px;
    height: 24px;
  }
`;

export const NotificationText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotificationHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

export const NotificationTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NotificationTime = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  opacity: 0.75;
`;

export const NotificationBody = styled.p`
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.35;
  opacity: 0.95;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
