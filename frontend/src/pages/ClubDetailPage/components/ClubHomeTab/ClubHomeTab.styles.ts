// 상세 '홈' 탭 섹션(본문·사진 미리보기·칩·타임라인·FAQ) 스타일
import styled, { css } from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';

const CLAMP_LINES = 4;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmptyState = styled.p`
  padding: 80px 0;
  text-align: center;
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[700]};

  ${media.tablet} {
    padding: 60px 20px;
    ${setTypography(typography.paragraph.p5)};
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 32px 0;

  & + & {
    border-top: 1px solid ${colors.gray[300]};
  }

  ${media.tablet} {
    gap: 12px;
    padding: 24px 20px;

    /* 모바일은 섹션 사이를 두꺼운 회색 띠로 끊는다 */
    & + & {
      border-top: 8px solid ${colors.gray[200]};
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  ${setTypography(typography.title.title5)};
  color: ${colors.base.black};

  ${media.tablet} {
    ${setTypography(typography.etc.bold18)};
  }
`;

export const HeaderLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};

  &:hover {
    color: ${colors.gray[900]};
  }
`;

export const BodyText = styled.div<{ $clamped?: boolean }>`
  ${setTypography(typography.paragraph.p4)};
  line-height: 170%;
  color: ${colors.gray[900]};
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;

  ${({ $clamped }) =>
    $clamped &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: ${CLAMP_LINES};
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}

  ${media.tablet} {
    ${setTypography(typography.paragraph.p6r)};
    line-height: 170%;
  }
`;

export const MoreButton = styled.button`
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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

export const PhotoStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;

  ${media.tablet} {
    display: flex;
    gap: 6px;
    margin: 0 -20px;
    padding: 0 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const PhotoThumb = styled.button`
  aspect-ratio: 1 / 1;
  padding: 0;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${colors.gray[100]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform ${transitions.duration.normal}
      ${transitions.easing.easeInOut};
  }

  @media (hover: hover) {
    &:hover img {
      transform: scale(1.05);
    }
  }

  ${media.tablet} {
    flex: 0 0 112px;
    width: 112px;
    border-radius: 10px;
    scroll-snap-align: start;
  }
`;

export const ChipList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.li`
  padding: 6px 12px;
  border-radius: 999px;
  background-color: ${colors.primary[500]};
  color: ${colors.primary[900]};
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;

  ${media.tablet} {
    padding: 5px 10px;
    ${setTypography(typography.button.button2)};
  }
`;

export const Callout = styled.div`
  padding: 18px 20px;
  border-radius: 16px;
  background-color: ${colors.gray[100]};
  ${setTypography(typography.paragraph.p4)};
  line-height: 170%;
  color: ${colors.gray[900]};
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;

  ${media.tablet} {
    padding: 16px;
    ${setTypography(typography.paragraph.p6r)};
    line-height: 170%;
  }
`;

export const Timeline = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

export const TimelineItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 16px;
  padding-bottom: 20px;

  /* 점과 세로선 */
  &::before {
    content: '';
    position: absolute;
    left: 100px;
    top: 7px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: ${colors.primary[900]};
    box-shadow: 0 0 0 3px ${colors.primary[500]};
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 104px;
    top: 18px;
    bottom: 0;
    width: 1px;
    background-color: ${colors.gray[300]};
  }

  &:last-child {
    padding-bottom: 0;
  }

  ${media.tablet} {
    grid-template-columns: 80px 1fr;

    &::before {
      left: 82px;
    }

    &:not(:last-child)::after {
      left: 86px;
    }
  }
`;

export const TimelineLabel = styled.span`
  ${setTypography(typography.paragraph.p5)};
  font-weight: 700;
  color: ${colors.gray[800]};
  padding-top: 1px;

  ${media.tablet} {
    ${setTypography(typography.button.button2)};
    padding-top: 2px;
  }
`;

export const TimelineBody = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 16px;
  ${setTypography(typography.paragraph.p3)};
  color: ${colors.gray[900]};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
  }
`;

export const FaqList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${colors.gray[300]};
`;

export const FaqItem = styled.li`
  border-bottom: 1px solid ${colors.gray[300]};
`;

export const FaqQuestion = styled.button`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 16px 4px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  ${setTypography(typography.paragraph.p2)};
  color: ${colors.gray[900]};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 600;
  }
`;

export const FaqMark = styled.span`
  ${setTypography(typography.title.title6)};
  color: ${colors.primary[900]};
`;

export const FaqChevron = styled.span<{ $isOpen: boolean }>`
  display: flex;
  color: ${colors.gray[600]};
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
  transition: transform ${transitions.duration.normal}
    ${transitions.easing.easeInOut};
`;

// grid-template-rows 0fr→1fr로 높이를 몰라도 부드럽게 펼친다
export const FaqAnswer = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? '1fr' : '0fr')};
  transition: grid-template-rows ${transitions.duration.normal}
    ${transitions.easing.easeInOut};

  > div {
    overflow: hidden;
  }
`;

export const FaqAnswerInner = styled.div`
  margin: 0 4px 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background-color: ${colors.gray[100]};
  ${setTypography(typography.paragraph.p4)};
  line-height: 170%;
  color: ${colors.gray[800]};
  white-space: pre-line;
  overflow-wrap: anywhere;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p6r)};
  }
`;
