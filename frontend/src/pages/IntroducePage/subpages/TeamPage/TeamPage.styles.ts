// 만드는 사람들 페이지의 인사말, 두 칸 이야기 블록, 큰 글씨 팀원 모집 마무리 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

/* 엘스 소개와 같은 비율: 큰 제목, 25px대 회색 본문, 48px 마무리 */
export const Intro = styled.section`
  max-width: 640px;
`;

export const Title = styled.h1`
  margin-bottom: 36px;
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${colors.gray[950]};

  ${media.mobile} {
    margin-bottom: 24px;
    font-size: 34px;
  }
`;

export const Lead = styled.p`
  font-size: 25px;
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: -0.01em;
  color: ${colors.gray[800]};
  word-break: keep-all;

  & + & {
    margin-top: 20px;
  }

  ${media.mobile} {
    font-size: 18px;
  }
`;

/* 굵은 두 줄 제목과 본문을 좌우로 둔다. 좁은 화면에서는 위아래로 쌓는다 */
export const Story = styled.section`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  margin-top: 120px;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 72px;
  }
`;

export const StoryTitle = styled.h2`
  font-size: 30px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: ${colors.gray[950]};
  word-break: keep-all;

  ${media.mobile} {
    font-size: 24px;
  }
`;

export const StoryBody = styled.div`
  p {
    font-size: 17px;
    line-height: 1.75;
    color: ${colors.gray[800]};
    word-break: keep-all;
  }

  p + p {
    margin-top: 12px;
  }

  ${media.mobile} {
    p {
      font-size: 16px;
    }
  }
`;

/* 마무리: 팀원 모집을 큰 글씨 블록으로 둔다 */
export const Closing = styled.section`
  margin-top: 160px;

  ${media.tablet} {
    margin-top: 96px;
  }
`;

export const ClosingBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  font-size: 46px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: keep-all;

  ${media.tablet} {
    font-size: 34px;
  }

  ${media.mobile} {
    font-size: 26px;
  }
`;

export const ClosingStrong = styled.p`
  color: ${colors.gray[950]};
`;

export const ClosingSoft = styled.p`
  color: ${colors.gray[500]};
`;

export const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.25s ease;
`;

export const ClosingAction = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin-top: 4px;
  color: ${colors.primary[900]};
  text-decoration: none;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 2px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease;

  @media (hover: hover) {
    &:hover {
      background-size: 100% 2px;
    }

    &:hover ${Arrow} {
      transform: translateX(6px);
    }
  }
`;
