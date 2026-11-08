// 만드는 사람들 페이지의 인사말, 두 칸 이야기 블록, 팀원 모집 띠, 큰 글씨 연락처 스타일
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Intro = styled.section`
  max-width: 560px;
`;

export const Title = styled.h1`
  margin-bottom: 28px;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.gray[950]};

  ${media.mobile} {
    margin-bottom: 20px;
    font-size: 28px;
  }
`;

export const Lead = styled.p`
  font-size: 17px;
  line-height: 1.75;
  color: ${colors.gray[900]};
  word-break: keep-all;

  & + & {
    margin-top: 12px;
  }

  ${media.mobile} {
    font-size: 16px;
  }
`;

/* 엘스 소개처럼 굵은 두 줄 제목과 본문을 좌우로 둔다. 좁은 화면에서는 위아래로 쌓는다 */
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

export const Recruit = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 120px;
  padding: 28px 32px;
  border-radius: 20px;
  background: ${colors.primary[500]};

  ${media.tablet} {
    margin-top: 72px;
    padding: 24px;
  }
`;

export const RecruitText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.gray[950]};
  word-break: keep-all;
`;

export const RecruitLink = styled.a`
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  background: ${colors.primary[900]};
  font-size: 15px;
  font-weight: 600;
  color: ${colors.base.white};
  text-decoration: none;
`;

/* 엘스 소개 마지막 연락처처럼: 검정 질문, 회색 안내, 검정 이메일을 같은 큰 글씨로 잇는다 */
export const Contact = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 140px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.02em;

  ${media.tablet} {
    margin-top: 88px;
    font-size: 24px;
  }
`;

export const ContactStrong = styled.p`
  color: ${colors.gray[950]};
`;

export const ContactSoft = styled.p`
  color: ${colors.gray[500]};
`;

export const ContactMail = styled.a`
  width: fit-content;
  color: ${colors.gray[950]};
  text-decoration: none;
  word-break: break-all;

  @media (hover: hover) {
    &:hover {
      color: ${colors.primary[900]};
    }
  }
`;
