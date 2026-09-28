import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 48px 0 40px;
`;

export const Eyebrow = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.primary[900]};
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
  min-height: 64px;
  margin-top: 24px;
  border: none;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primary[900]};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;
