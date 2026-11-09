// 자주 묻는 질문 목록의 구분선, 펼침 아이콘(+ → ×), 답변 영역 스타일
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Section = styled.section`
  width: 100%;
  max-width: 760px;
  margin: 0 auto 160px;
  padding: 0 24px;

  ${media.tablet} {
    margin-bottom: 100px;
    padding: 0 20px;
  }
`;

export const Title = styled.h2`
  margin-bottom: 32px;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${colors.gray[950]};

  ${media.tablet} {
    margin-bottom: 20px;
    font-size: 26px;
  }
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  border-top: 1px solid ${colors.gray[300]};
`;

export const Item = styled.li`
  border-bottom: 1px solid ${colors.gray[300]};
`;

export const Question = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 26px 4px;
  border: none;
  background: none;
  font-size: 20px;
  font-weight: 500;
  text-align: left;
  color: ${colors.gray[950]};
  cursor: pointer;
  word-break: keep-all;

  &:focus-visible {
    outline: 2px solid ${colors.primary[700]};
    outline-offset: 2px;
  }

  ${media.tablet} {
    padding: 20px 2px;
    font-size: 17px;
  }
`;

/* 닫혀 있으면 +, 열리면 45도 돌아 ×가 된다 */
export const Toggle = styled.span<{ $open: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  transform: rotate(${({ $open }) => ($open ? 45 : 0)}deg);
  transition: transform 0.25s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background: ${colors.gray[700]};
    transform: translateY(-50%);
  }

  &::after {
    transform: translateY(-50%) rotate(90deg);
  }
`;

export const AnswerWrap = styled(motion.div)`
  overflow: hidden;
`;

export const Answer = styled.p`
  padding: 0 4px 26px;
  font-size: 17px;
  line-height: 1.65;
  color: ${colors.gray[700]};
  word-break: keep-all;

  ${media.tablet} {
    padding-bottom: 20px;
    font-size: 15px;
  }
`;
