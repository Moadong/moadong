// 기능 한 줄의 좌우 배치, 얇고 큰 글자, 연회색 화면 패널 스타일 (여백을 넉넉히 둔다)
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const List = styled.section`
  position: relative;
  /* 로고 도형(z-index:-1)이 배경 위, 글자 아래에 놓이도록 쌓임 맥락을 만든다 */
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: 180px;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto 200px;
  padding: 0 24px;

  ${media.laptop} {
    gap: 140px;
  }

  ${media.tablet} {
    gap: 96px;
    margin-bottom: 120px;
    padding: 0 20px;
  }
`;

/* 기능 목록 맨 위 제목: 단톡방 마지막 메시지에 답하며 해결책으로 넘어간다 */
export const ListHeading = styled.h2`
  margin-bottom: -60px;
  line-height: 1.3;
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  color: ${colors.gray[950]};
  word-break: keep-all;

  ${media.laptop} {
    margin-bottom: -40px;
    font-size: 38px;
  }

  ${media.tablet} {
    margin-bottom: -40px;
    font-size: 28px;
  }
`;

export const ListHeadingBrand = styled.span`
  color: ${colors.primary[900]};
`;

export const Row = styled(motion.article)<{ $reverse: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 72px;

  ${({ $reverse }) =>
    $reverse &&
    `
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);

    & > :first-child {
      order: 2;
    }
  `}

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 32px;

    & > :first-child {
      order: 0;
    }
  }
`;

export const Text = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 44px;
  font-weight: 600;
  line-height: 1.32;
  letter-spacing: -0.02em;
  color: ${colors.gray[950]};
  white-space: pre-line;
  word-break: keep-all;

  ${media.laptop} {
    font-size: 38px;
  }

  ${media.tablet} {
    font-size: 30px;
  }

  ${media.mobile} {
    font-size: 27px;
  }
`;

export const Caption = styled.p`
  margin-top: 20px;
  font-size: 19px;
  font-weight: 400;
  line-height: 1.55;
  color: ${colors.gray[700]};
  word-break: keep-all;

  ${media.tablet} {
    margin-top: 14px;
    font-size: 16px;
  }
`;

export const MoreLink = styled.a`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 28px;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primary[900]};
  text-decoration: none;

  span {
    font-size: 22px;
    line-height: 1;
  }

  ${media.tablet} {
    margin-top: 18px;
    font-size: 16px;
  }
`;

/* 모든 기능 줄의 화면 칸은 같은 크기다. 내용이 길면 아래를 흐리게 자른다 */
export const PANEL_HEIGHT = { desktop: 560, tablet: 440 } as const;

export const Panel = styled(motion.div)`
  display: flex;
  justify-content: center;
  height: ${PANEL_HEIGHT.desktop}px;
  padding: 48px 40px 0;
  border-radius: 32px;
  background: ${colors.gray[100]};
  overflow: hidden;

  ${media.tablet} {
    height: ${PANEL_HEIGHT.tablet}px;
    padding: 28px 20px 0;
    border-radius: 24px;
  }
`;

/* 실제 화면 한 장. 칸 끝까지 같은 높이로 채우고, 길면 아래를 흐리게 잘라 화면이 이어지는 느낌을 준다 */
export const Screen = styled.div`
  width: 100%;
  max-width: 420px;
  height: 100%;
  padding: 18px;
  border-radius: 24px 24px 0 0;
  background: ${colors.base.white};
  box-shadow: 0 -2px 30px rgba(17, 17, 17, 0.06);
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  mask-image: linear-gradient(180deg, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, black 80%, transparent 100%);
`;

/* 폰 목업처럼 스스로 틀을 가진 화면은 카드 없이 그대로 둔다 */
export const Bare = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: none;
  user-select: none;
`;

/* 바로 가기 링크 자리에 두는 버튼 (링크와 같은 모양) */
export const MoreButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 28px;
  padding: 0;
  border: none;
  background: none;
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primary[900]};
  cursor: pointer;

  span {
    font-size: 22px;
    line-height: 1;
  }

  ${media.tablet} {
    margin-top: 18px;
    font-size: 16px;
  }
`;
