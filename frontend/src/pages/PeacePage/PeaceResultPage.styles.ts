import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0 40px;
`;

export const Lead = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const Detail = styled.section<{ $back: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
  border-radius: 24px;
  background: ${({ $back }) => $back};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  color: ${({ theme }) => theme.colors.base.black};
  margin-bottom: 8px;
`;

export const Body = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[800]};
  word-break: keep-all;
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Tag = styled.button<{ $main: string }>`
  min-height: 48px;
  padding: 10px 18px;
  border: 1.5px solid ${({ $main }) => $main};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.base.black};
  cursor: pointer;

  &:active {
    background: ${({ $main }) => $main};
    color: ${({ theme }) => theme.colors.base.white};
  }
`;

export const RetryButton = styled.button`
  width: 100%;
  min-height: 64px;
  margin-top: 12px;
  border: none;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.base.black};
  color: ${({ theme }) => theme.colors.base.white};
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  cursor: pointer;
`;

export const SubLine = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const QrBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.base.white};
`;

export const QrCaption = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p2)};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-align: center;
`;

export const ShareButton = styled.button`
  width: 100%;
  min-height: 64px;
  margin-top: 32px;
  border: 1.5px solid ${({ theme }) => theme.colors.base.black};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ theme }) => theme.colors.base.black};
  ${({ theme }) => setTypography(theme.typography.title.title5)};
  cursor: pointer;
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const Chip = styled.span<{ $main: string }>`
  padding: 6px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ $main }) => $main};
  ${({ theme }) => setTypography(theme.typography.paragraph.p5)};
`;

export const ActionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 20px;
`;

export const ActionItem = styled.li`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  color: ${({ theme }) => theme.colors.gray[800]};
  word-break: keep-all;
`;

export const StudentToggle = styled.button`
  width: 100%;
  min-height: 56px;
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.base.white};
  color: ${({ theme }) => theme.colors.base.black};
  ${({ theme }) => setTypography(theme.typography.title.title6)};
  cursor: pointer;
`;

export const StudentPanel = styled.section<{ $back: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 8px;
  padding: 24px;
  border-radius: 16px;
  background: ${({ $back }) => $back};
`;
