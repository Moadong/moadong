// 신입생 판단용 구조화 섹션(한눈에 보기·키워드·맞춤·1년 활동·가입 과정·부원 한마디) 스타일
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

// HorizontalScroller 안에서 한 줄로 늘어서는 카드 트랙. 스크롤·흐림은 바깥 래퍼가 맡는다
const scrollTrack = css`
  display: flex;
  width: max-content;
  min-width: 100%;
`;

/* 한눈에 보기 */

export const FactGrid = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

export const FactCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px;
  border-radius: 16px;
  background-color: ${colors.gray[100]};

  ${media.tablet} {
    padding: 14px;
    border-radius: 14px;
  }
`;

export const FactEmoji = styled.span`
  font-size: 26px;
  margin-bottom: 8px;

  ${media.tablet} {
    font-size: 22px;
    margin-bottom: 6px;
  }
`;

export const FactLabel = styled.span`
  ${setTypography(typography.etc.medium12)};
  color: ${colors.gray[600]};
`;

export const FactValue = styled.strong`
  ${setTypography(typography.paragraph.p2)};
  color: ${colors.base.black};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 700;
  }
`;

export const FactSub = styled.span`
  ${setTypography(typography.paragraph.p7)};
  color: ${colors.gray[700]};
`;

/* 부원 키워드 */

export const VoteBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const VoteList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const VoteRow = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 20px 0 16px;
  border-radius: 12px;
  background-color: ${colors.gray[50]};
  overflow: hidden;
  isolation: isolate;

  ${media.tablet} {
    height: 50px;
    gap: 10px;
    padding: 0 16px 0 14px;
  }
`;

export const VoteFill = styled.span<{ $ratio: number; $isTop: boolean }>`
  position: absolute;
  inset: 0 auto 0 0;
  z-index: -1;
  width: ${({ $ratio }) => $ratio * 100}%;
  border-radius: 12px;
  background-color: ${({ $isTop }) =>
    $isTop ? colors.primary[600] : colors.primary[500]};
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const VoteEmoji = styled.span`
  font-size: 24px;

  ${media.tablet} {
    font-size: 20px;
  }
`;

export const VoteLabel = styled.span`
  ${setTypography(typography.paragraph.p2)};
  color: ${colors.gray[950]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 600;
  }
`;

export const VoteCount = styled.span`
  ${setTypography(typography.title.title6)};
  color: ${colors.primary[900]};
  font-variant-numeric: tabular-nums;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 700;
  }
`;

export const GhostButton = styled.button`
  height: 44px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 12px;
  background-color: ${colors.base.white};
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[800]};

  &:hover {
    background-color: ${colors.gray[50]};
  }
`;

/* 나랑 맞을까 */

export const FitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const FitCard = styled.div<{ $tone: 'good' | 'caution' }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 16px;
  background-color: ${({ $tone }) =>
    $tone === 'good' ? colors.accent[2][500] : colors.gray[100]};
`;

export const FitTitle = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  ${setTypography(typography.title.title6)};
  color: ${colors.gray[950]};

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 700;
  }
`;

export const FitList = styled.ul<{ $tone: 'good' | 'caution' }>`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: baseline;
    gap: 10px;
    ${setTypography(typography.paragraph.p3)};
    color: ${colors.gray[900]};
    word-break: keep-all;

    /* 카드 색에 맞춘 작은 점으로 항목을 구분한다 */
    &::before {
      content: '';
      flex-shrink: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      transform: translateY(-3px);
      background-color: ${({ $tone }) =>
        $tone === 'good' ? colors.accent[2][950] : colors.gray[600]};
    }

    ${media.tablet} {
      ${setTypography(typography.paragraph.p5)};
    }
  }
`;

/* 1년 활동 */

export const YearScroller = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 8px;
  ${scrollTrack};
`;

export const MonthCard = styled.li<{ $isUpcoming: boolean }>`
  flex: 0 0 132px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 16px;
  scroll-snap-align: start;
  border: 1.5px solid
    ${({ $isUpcoming }) =>
      $isUpcoming ? colors.primary[800] : colors.gray[300]};
  background-color: ${({ $isUpcoming }) =>
    $isUpcoming ? colors.primary[500] : colors.base.white};

  ${media.tablet} {
    flex-basis: 116px;
    padding: 12px;
  }
`;

export const MonthLabel = styled.span<{ $isUpcoming: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 700;
  color: ${({ $isUpcoming }) =>
    $isUpcoming ? colors.primary[900] : colors.gray[700]};
`;

export const NextBadge = styled.span`
  padding: 1px 6px;
  border-radius: 999px;
  background-color: ${colors.primary[900]};
  color: ${colors.base.white};
  ${setTypography(typography.button.button2)};
`;

export const MonthEmoji = styled.span`
  font-size: 28px;
`;

export const MonthTitle = styled.span`
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.gray[950]};
  word-break: keep-all;
`;

/* 부원 한마디 */

export const VoiceScroller = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 10px;
  ${scrollTrack};
`;

export const VoiceCard = styled.li`
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border-radius: 18px;
  background-color: ${colors.gray[100]};
  scroll-snap-align: start;
  transition: transform ${transitions.duration.fast} ${transitions.easing.ease};

  ${media.tablet} {
    flex-basis: 260px;
    padding: 18px;
  }
`;

export const VoiceQuote = styled.p`
  ${setTypography(typography.paragraph.p4)};
  line-height: 165%;
  color: ${colors.gray[950]};
  word-break: keep-all;

  &::before {
    content: '“';
    display: block;
    margin-bottom: 2px;
    font-size: 32px;
    line-height: 1;
    font-weight: 700;
    color: ${colors.primary[800]};
  }

  ${media.tablet} {
    ${setTypography(typography.paragraph.p6r)};
    line-height: 165%;
  }
`;

export const VoiceAuthor = styled.p`
  ${setTypography(typography.paragraph.p7)};
  font-weight: 600;
  color: ${colors.gray[700]};

  span {
    font-weight: 400;
  }
`;
