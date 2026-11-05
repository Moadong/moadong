import styled from 'styled-components';

// 게임 랭킹에서만 쓰는 색이라 디자인 토큰이 아니라 여기 둔다
const DARK_ROW = { background: '#22222E', hover: '#2C2C3A' };
const MEDAL_COLORS: Record<number, string> = {
  1: '#FFB300',
  2: '#9E9E9E',
  3: '#CD7F32',
};

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
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.base.white : theme.colors.gray[900]};
`;

export const List = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Item = styled.div<{
  $dark: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${({ $dark, theme }) =>
    $dark ? DARK_ROW.background : theme.colors.base.white};
  border: ${({ $dark, theme }) =>
    $dark ? '2px solid transparent' : `2px solid ${theme.colors.gray[300]}`};
  box-shadow: ${({ $dark }) =>
    $dark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.06)'};
  transition: background 0.3s;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: ${({ $dark, theme }) =>
      $dark ? DARK_ROW.hover : theme.colors.gray[100]};
  }
`;

export const Rank = styled.span<{ $rank: number }>`
  width: 28px;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: ${({ $rank, theme }) => MEDAL_COLORS[$rank] ?? theme.colors.gray[600]};
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

export const ClickCount = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

export const EmptyMessage = styled.p<{ $dark: boolean }>`
  text-align: center;
  padding: 40px 0;
  color: ${({ $dark, theme }) =>
    $dark ? theme.colors.gray[400] : theme.colors.gray[500]};
  font-size: 0.95rem;
`;
