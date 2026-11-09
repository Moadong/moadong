// 업데이트 기록의 제목, 날짜·내용 두 칸 목록, 실제 화면을 담는 연한 색 프레임 스타일
import styled from 'styled-components';
import type { UpdateImageKind } from '@/pages/IntroducePage/constants/updates';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Hero = styled.div`
  margin-bottom: 56px;

  ${media.mobile} {
    margin-bottom: 36px;
  }
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.gray[950]};

  ${media.mobile} {
    font-size: 28px;
  }
`;

export const Subtitle = styled.p`
  margin-top: 12px;
  font-size: 17px;
  line-height: 1.6;
  color: ${colors.gray[800]};
  word-break: keep-all;

  ${media.mobile} {
    font-size: 15px;
  }
`;

export const List = styled.ol`
  list-style: none;
`;

export const Entry = styled.li`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  padding: 40px 0;
  border-top: 1px solid ${colors.gray[300]};

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 28px 0;
  }
`;

export const Date = styled.time`
  padding-top: 6px;
  font-size: 15px;
  color: ${colors.gray[700]};

  /* 폰에서는 날짜를 한 단계 진하게 해 밝은 데서도 읽히게 한다 */
  ${media.mobile} {
    color: ${colors.gray[800]};
  }
`;

export const Body = styled.div`
  min-width: 0;
`;

export const EntryTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: ${colors.gray[950]};
  word-break: keep-all;

  ${media.mobile} {
    font-size: 21px;
  }
`;

/**
 * 이미지 규격: 본문 칼럼 전체 폭, 4:3 고정. 연한 브랜드색 판 위에 실제 화면 캡처를 위에서부터 세우고
 * 아래는 판 밖으로 잘라 낸다. 종류별 폭은 constants/updates.ts의 규격을 따른다
 */
export const Frame = styled.div<{ $tone: number }>`
  position: relative;
  aspect-ratio: 4 / 3;
  margin-top: 24px;
  border-radius: 20px;
  background: ${({ $tone }) => FRAME_TONES[$tone % FRAME_TONES.length]};
  overflow: hidden;
`;

const SHOT_WIDTH: Record<UpdateImageKind, string> = {
  phone: '46%',
  panel: '70%',
  mockup: 'auto',
};

/* 항목마다 판 색을 돌려 가며 칠해 목록이 단조롭지 않게 한다 (브랜드 주황 → 파랑 → 민트 → 보라 → 노랑 → 분홍) */
const FRAME_TONES = [
  colors.primary[500],
  colors.secondary[4].back,
  colors.secondary[3].back,
  colors.secondary[6].back,
  colors.secondary[2].back,
  colors.secondary[1].back,
];

export const Shot = styled.img<{ $kind: UpdateImageKind }>`
  position: absolute;
  top: ${({ $kind }) => ($kind === 'mockup' ? '6%' : '9%')};
  left: 50%;
  display: block;
  width: ${({ $kind }) => SHOT_WIDTH[$kind]};
  height: ${({ $kind }) => ($kind === 'mockup' ? '94%' : 'auto')};
  border-radius: ${({ $kind }) => ($kind === 'mockup' ? 0 : '20px')};
  box-shadow: ${({ $kind }) =>
    $kind === 'mockup'
      ? 'none'
      : `0 8px 32px color-mix(in srgb, ${colors.gray[950]} 10%, transparent)`};
  translate: -50% 0;
`;

export const Description = styled.p`
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.7;
  color: ${colors.gray[800]};
  word-break: keep-all;
`;
