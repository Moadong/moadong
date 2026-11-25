// 상세 상단 요약(이름·소개·모집 상태·바로가기) 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';
import { RecruitmentStatus } from '@/types/club';

// 흰 배경에서 글자로 읽힐 만큼 대비가 나오는 색을 고른다
const STATUS_TEXT_COLOR: Record<RecruitmentStatus, string> = {
  OPEN: colors.accent[1][950],
  UPCOMING: colors.accent[1][950],
  ALWAYS: colors.accent[2][950],
  CLOSED: colors.gray[600],
};

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 0 0;

  ${media.tablet} {
    padding: 20px 20px 0;
    gap: 10px;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Logo = styled.img`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  object-fit: cover;
  border: 1px solid ${colors.gray[300]};
  background-color: ${colors.base.white};

  ${media.tablet} {
    width: 52px;
    height: 52px;
    border-radius: 14px;
  }
`;

export const TitleText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const Meta = styled.span`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[600]};

  ${media.tablet} {
    ${setTypography(typography.etc.medium12)};
  }
`;

export const Name = styled.h1`
  ${setTypography(typography.title.title2)};
  color: ${colors.base.black};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.title.title4)};
  }
`;

export const Intro = styled.p`
  ${setTypography(typography.paragraph.p4)};
  color: ${colors.gray[800]};
  word-break: keep-all;

  ${media.tablet} {
    ${setTypography(typography.paragraph.p6)};
  }
`;

export const Tags = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Tag = styled.li`
  ${setTypography(typography.paragraph.p5)};
  color: ${colors.gray[700]};

  ${media.tablet} {
    ${setTypography(typography.etc.medium12)};
  }
`;

export const StatusLine = styled.p<{ $status: RecruitmentStatus }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  color: ${({ $status }) => STATUS_TEXT_COLOR[$status]};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
  }
`;

export const StatusLabel = styled.strong`
  ${setTypography(typography.paragraph.p2)};

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: 700;
  }
`;

export const StatusDetail = styled.span<{ $isUrgent: boolean }>`
  ${setTypography(typography.paragraph.p3)};
  color: ${({ $isUrgent }) =>
    $isUrgent ? colors.primary[900] : colors.gray[800]};
  font-weight: ${({ $isUrgent }) => ($isUrgent ? 700 : 500)};

  ${media.tablet} {
    ${setTypography(typography.paragraph.p5)};
    font-weight: ${({ $isUrgent }) => ($isUrgent ? 700 : 500)};
  }
`;

export const Actions = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);
  margin-top: 12px;
  padding: 14px 0;
  border-top: 1px solid ${colors.gray[300]};
  border-bottom: 1px solid ${colors.gray[300]};

  ${media.tablet} {
    margin: 8px -20px 0;
    padding: 12px 8px;
    border-bottom: none;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  border: none;
  background: none;
  cursor: pointer;
  ${setTypography(typography.etc.medium12)};
  color: ${colors.gray[800]};

  & + & {
    box-shadow: inset 1px 0 0 ${colors.gray[250]};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[800]};
    border-radius: 8px;
  }
`;

export const ActionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: ${colors.gray[900]};
  background-color: ${colors.gray[100]};
  transition: background-color ${transitions.duration.fast}
    ${transitions.easing.ease};

  @media (hover: hover) {
    ${ActionButton}:hover & {
      background-color: ${colors.primary[500]};
      color: ${colors.primary[900]};
    }
  }
`;
