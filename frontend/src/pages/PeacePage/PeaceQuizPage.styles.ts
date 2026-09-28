import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const BackButton = styled.button`
  border: none;
  background: transparent;
  padding: 8px 12px;
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
`;

export const Progress = styled.span`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const ProgressBar = styled.div<{ $ratio: number }>`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: 32px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${({ $ratio }) => $ratio * 100}%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary[900]};
    transition: width ${({ theme }) => theme.transitions.duration.normal};
  }
`;

export const Question = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title3)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 32px;
  word-break: keep-all;
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionButton = styled.button`
  width: 100%;
  min-height: 64px;
  padding: 16px 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.base.black};
  text-align: left;
  word-break: keep-all;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;
