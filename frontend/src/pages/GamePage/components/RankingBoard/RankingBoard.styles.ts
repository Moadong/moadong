import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  max-width: 480px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const ResetInfo = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const List = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Item = styled.li<{ $isMe: boolean; $rank: number }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${({ $isMe, theme }) =>
    $isMe ? theme.colors.primary[500] : theme.colors.gray[100]};
  border: ${({ $isMe, theme }) =>
    $isMe ? `2px solid ${theme.colors.primary[900]}` : '2px solid transparent'};
  transition: background 0.3s;
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

export const ClubName = styled.span`
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ClickCount = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const EmptyMessage = styled.p`
  text-align: center;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.95rem;
`;
