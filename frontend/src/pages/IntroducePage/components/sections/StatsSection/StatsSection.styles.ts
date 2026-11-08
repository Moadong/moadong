// 수치 띠의 제목, 칸 배치, 큰 숫자와 작은 단위, 오른쪽 아래 기준 시점 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Section = styled.section`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto 160px;
  padding: 0 24px;

  ${media.tablet} {
    margin-bottom: 100px;
    padding: 0 20px;
  }
`;

export const Headline = styled.h2`
  margin-bottom: 40px;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  text-align: center;
  white-space: pre-line;
  word-break: keep-all;
  color: ${colors.gray[950]};

  ${media.laptop} {
    font-size: 34px;
  }

  ${media.tablet} {
    margin-bottom: 24px;
    font-size: 26px;
  }
`;

export const Grid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 20px;
  border-radius: 28px;
  background: ${colors.gray[100]};

  ${media.tablet} {
    padding: 24px 20px;
    border-radius: 22px;
  }
`;

export const Label = styled.p`
  font-size: 17px;
  font-weight: 500;
  color: ${colors.gray[700]};

  ${media.tablet} {
    font-size: 15px;
  }
`;

export const Value = styled.p`
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${colors.gray[950]};
  font-variant-numeric: tabular-nums;

  ${media.tablet} {
    font-size: 36px;
  }
`;

/* 단위는 숫자보다 작고 흐리게: 눈에 들어오는 건 숫자다 */
export const Unit = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: ${colors.gray[700]};

  ${media.tablet} {
    font-size: 18px;
  }
`;

/* 기준 시점은 칸마다 반복하지 않고 오른쪽 아래 한 줄로 */
export const SourceNote = styled.p`
  margin-top: 12px;
  font-size: 12px;
  text-align: right;
  color: ${colors.gray[600]};
  word-break: keep-all;

  ${media.tablet} {
    text-align: center;
  }
`;
