import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';
import { PEACE_GREEN } from './constants/peaceColors';

export const Hero = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
`;

export const Dove = styled.img`
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
  filter: drop-shadow(0 12px 24px ${PEACE_GREEN.shadow});
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${PEACE_GREEN.main};
`;

export const Title = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title2)};
  color: ${({ theme }) => theme.colors.base.black};
`;

export const Description = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-line;
`;

export const StartButton = styled.button`
  width: 100%;
  min-height: 56px;
  margin-top: auto;
  margin-bottom: 24px;
  border: none;
  border-radius: 16px;
  background: ${PEACE_GREEN.main};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title6)};
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;
