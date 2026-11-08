import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const IntroSection = styled(motion.section)`
  width: 100%;
  padding: 0 0 150px;
  background: linear-gradient(
    180deg,
    rgba(255, 84, 20, 0.004) 0%,
    rgba(255, 84, 20, 0.08) 55.29%,
    rgba(255, 84, 20, 0.004) 100%
  );
  position: relative;
  overflow: hidden;
  /* 로고 도형(z-index:-1)이 배경 위, 글자 아래에 놓이도록 쌓임 맥락을 만든다 */
  isolation: isolate;

  ${media.laptop} {
    padding: 0 0 120px;
  }

  ${media.tablet} {
    padding: 40px 0 80px;
  }

  ${media.mobile} {
    padding: 30px 0 60px;
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
`;

/* 앱 설치 QR 카드가 아래 폰 목업 위로 뜨도록 화면 영역보다 위에 쌓는다 */
export const TextWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;

  ${media.laptop} {
    margin-top: 60px;
  }

  ${media.tablet} {
    margin-top: 40px;
  }

  ${media.mobile} {
    margin-top: 30px;
  }
`;

export const IntroTitle = styled(motion.h1)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.03em;
  text-align: center;
  color: ${colors.gray[950]};
  word-break: keep-all;

  ${media.laptop} {
    font-size: 54px;
  }

  ${media.tablet} {
    font-size: 40px;
  }

  ${media.mini_mobile} {
    font-size: 34px;
  }
`;

/* 줄 아래쪽을 잘라 글자가 바닥에서 올라오는 것처럼 보이게 한다 */
export const TitleLineMask = styled.span`
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
`;

export const TitleLine = styled(motion.span)`
  display: block;
`;

export const IntroSubtitle = styled(motion.p)`
  margin-top: 20px;
  font-size: 22px;
  font-weight: 500;
  color: ${colors.gray[700]};
  text-align: center;
  word-break: keep-all;

  ${media.tablet} {
    margin-top: 14px;
    font-size: 17px;
  }
`;

export const ActionsWrapper = styled(motion.div)`
  margin-top: 28px;

  ${media.tablet} {
    margin-top: 20px;
  }
`;

export const VisualWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 56px;

  ${media.tablet} {
    margin-top: 40px;
  }
`;

export const Doodles = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
`;

/* 학생 폰·운영진 대시보드를 담는 칸. 폭은 페이지 틀 기준이라 좁은 틀에서도 넘치지 않는다 */
export const Phone = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 24px;

  ${media.tablet} {
    padding: 0 16px;
  }
`;
