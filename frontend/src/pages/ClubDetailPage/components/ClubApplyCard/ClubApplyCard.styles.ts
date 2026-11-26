// 데스크톱 지원 카드 스타일. 상태 한 줄·큰 남은 시간·가는 선의 정보 행·지원 버튼
import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { transitions } from '@/styles/theme/transitions';
import { setTypography, typography } from '@/styles/theme/typography';
import { RecruitmentStatus } from '@/types/club';

const STATUS_COLOR: Record<RecruitmentStatus, string> = {
  OPEN: colors.accent[1][950],
  UPCOMING: colors.accent[1][950],
  ALWAYS: colors.accent[2][950],
  CLOSED: colors.gray[600],
};

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  padding: 24px 22px 20px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 20px;
  background-color: ${colors.base.white};
`;

export const Status = styled.p<{ $status: RecruitmentStatus }>`
  display: flex;
  align-items: center;
  gap: 6px;
  ${setTypography(typography.paragraph.p5)};
  font-weight: 700;
  color: ${({ $status }) => STATUS_COLOR[$status]};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: currentColor;
  }
`;

export const Headline = styled.p<{ $isUrgent: boolean }>`
  margin-top: 6px;
  ${setTypography(typography.title.title4)};
  letter-spacing: -0.02em;
  color: ${({ $isUrgent }) =>
    $isUrgent ? colors.primary[900] : colors.base.black};
  word-break: keep-all;
`;

export const Sub = styled.p`
  margin-top: 2px;
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[700]};
`;

export const Rows = styled.dl`
  margin: 18px 0 0;
  border-top: 1px solid ${colors.gray[300]};

  > div {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 10px;
    padding: 11px 0;
    border-bottom: 1px solid ${colors.gray[250]};
  }

  dt {
    ${setTypography(typography.paragraph.p6)};
    color: ${colors.gray[600]};
  }

  dd {
    margin: 0;
    ${setTypography(typography.paragraph.p5)};
    font-weight: 600;
    color: ${colors.gray[950]};
    word-break: keep-all;

    span {
      display: block;
      margin-top: 2px;
      ${setTypography(typography.paragraph.p7)};
      font-weight: 400;
      color: ${colors.gray[600]};
    }
  }
`;

export const ApplyButton = styled.button`
  margin-top: 18px;
  height: 52px;
  border: none;
  border-radius: 14px;
  background-color: ${colors.gray[900]};
  color: ${colors.base.white};
  ${setTypography(typography.paragraph.p2)};
  cursor: pointer;
  transition: background-color ${transitions.duration.fast}
    ${transitions.easing.ease};

  &:hover:not(:disabled) {
    background-color: ${colors.gray[800]};
  }

  &:disabled {
    background-color: ${colors.gray[300]};
    color: ${colors.gray[600]};
    cursor: default;
  }
`;

export const Hint = styled.p`
  margin-top: 8px;
  text-align: center;
  ${setTypography(typography.paragraph.p7)};
  color: ${colors.gray[600]};
`;
