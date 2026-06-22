import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 32px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

export const Title = styled.h3<{ $dark: boolean }>`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ $dark, theme }) => ($dark ? '#FFFFFF' : theme.colors.gray[900])};
`;

export const List = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Item = styled.div<{
  $isMe: boolean;
  $rank: number;
  $dark: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${({ $isMe, $dark, theme }) => {
    if ($dark) return $isMe ? 'rgba(255, 84, 20, 0.18)' : '#22222E';
    return $isMe ? theme.colors.primary[500] : '#FFFFFF';
  }};
  border: ${({ $isMe, $dark, theme }) => {
    if ($isMe) return `2px solid ${theme.colors.primary[900]}`;
    return $dark
      ? '2px solid transparent'
      : `2px solid ${theme.colors.gray[300]}`;
  }};
  box-shadow: ${({ $isMe, $dark }) =>
    !$isMe && !$dark ? '0 1px 3px rgba(0, 0, 0, 0.06)' : 'none'};
  transition: background 0.3s;
  cursor: pointer;
  text-decoration: none;
`;

export const Rank = styled.span<{ $rank: number }>`
  width: 28px;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: ${({ $rank, theme }) => {
    if ($rank === 1) return '#FFB300';
    if ($rank === 2) return '#9E9E9E';
    if ($rank === 3) return '#CD7F32';
    return theme.colors.gray[600];
  }};
`;

export const ClubName = styled.span<{ $dark: boolean }>`
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[100] : theme.colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RankDelta = styled.span<{ $direction: 'up' | 'down' }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $direction }) => ($direction === 'up' ? '#E53935' : '#1E88E5')};
  white-space: nowrap;
`;

export const ClickCount = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const DetailLink = styled.span<{ $dark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.875rem;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[500] : theme.colors.gray[400]};
  text-decoration: none;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const MoreButton = styled.button<{ $dark: boolean }>`
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background: ${({ $dark }) => ($dark ? '#2A2A36' : '#F0F0F0')};
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[300] : theme.colors.gray[600]};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ $dark }) => ($dark ? '#33333F' : '#E5E5E5')};
  }
`;

export const EmptyMessage = styled.p<{ $dark: boolean }>`
  text-align: center;
  padding: 40px 0;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[400] : theme.colors.gray[500]};
  font-size: 0.95rem;
`;
