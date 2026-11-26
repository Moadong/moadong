// 상세 본문 섹션(소개·사진·성과 타임라인·FAQ 등) 공통 레이아웃과 본문 스타일
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

// 성격이 같은 섹션 묶음. 묶음 사이에만 구분선을 둔다 (모바일은 굵은 회색 띠)
export const Chapter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;

  & + & {
    border-top: 1px solid ${colors.gray[300]};
  }

  ${media.tablet} {
    padding: 8px 0;

    & + & {
      border-top: 8px solid ${colors.gray[200]};
    }
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px 0;
  /* 바로가기로 이동했을 때 고정 헤더·상단바에 제목이 가리지 않게 */
  scroll-margin-top: 100px;

  ${media.tablet} {
    gap: 12px;
    padding: 18px 20px;
    scroll-margin-top: 56px;
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
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-top: -4px;
  padding: 4px 0;
  border: none;
  background: none;
  cursor: pointer;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 600;
  color: ${colors.gray[700]};

  &:hover {
    color: ${colors.gray[950]};
  }
`;

export const SectionDescription = styled.p`
  margin-top: -8px;
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};

  ${media.tablet} {
    margin-top: -6px;
    ${setTypography(typography.paragraph.p7)};
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
