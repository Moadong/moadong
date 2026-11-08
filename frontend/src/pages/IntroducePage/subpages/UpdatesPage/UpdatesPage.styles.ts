// 업데이트 기록의 제목, 날짜·내용 두 칸 목록, 실제 화면을 담는 연한 색 프레임 스타일
import styled from 'styled-components';
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
  color: ${colors.gray[600]};
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

/* 실제 앱 화면을 연한 브랜드색 판 위에 세워 보여 준다 */
export const Frame = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 32px 24px 0;
  border-radius: 20px;
  background: ${colors.primary[500]};
  overflow: hidden;
`;

export const Shot = styled.img`
  display: block;
  width: min(300px, 80%);
  height: auto;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 24px rgba(17, 17, 17, 0.08);
`;

export const Description = styled.p`
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.7;
  color: ${colors.gray[800]};
  word-break: keep-all;
`;
