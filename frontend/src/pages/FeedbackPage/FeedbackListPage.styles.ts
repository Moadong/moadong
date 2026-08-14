import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Container = styled.div`
  min-height: 100dvh;
  padding-bottom: 100px;
  background: ${colors.base.white};
`;

/* 시안 세로 리듬: 탑바 ↓18 탭 ↓20 필터 ↓8 목록 */
export const Tabs = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  margin-top: 18px;
  border-bottom: 1px solid ${colors.gray[300]};
`;

export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 100%;
  padding: 10px;
  border: none;
  border-bottom: ${({ $active }) =>
    $active ? `1.6px solid ${colors.base.black}` : 'none'};
  background: none;
  ${setTypography(typography.button.button1)};
  color: ${({ $active }) => ($active ? colors.gray[900] : colors.gray[500])};
  letter-spacing: -0.28px;
  cursor: pointer;
`;

export const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  height: 52px;
  margin: 20px 0 8px;
  padding: 10px 20px;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 6px 12px;
  border: none;
  border-radius: 100px;
  background: ${({ $active }) =>
    $active ? colors.gray[900] : colors.gray[200]};
  ${setTypography(typography.button.button1)};
  color: ${({ $active }) => ($active ? colors.gray[200] : colors.gray[900])};
  letter-spacing: -0.28px;
  white-space: nowrap;
  cursor: pointer;
`;

/** 읽지 않은 편지가 있는 분류에만 표시한다 */
export const UnreadDot = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${colors.primary[900]};
`;

export const EmptyText = styled.p`
  padding: 60px 20px;
  ${setTypography(typography.paragraph.p6)};
  color: ${colors.gray[600]};
  text-align: center;
`;

export const WriteButton = styled.button`
  position: fixed;
  right: 20px;
  /* 시안은 24지만 홈 인디케이터에 가리지 않도록 안전 영역을 더한다 */
  bottom: calc(24px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: ${colors.primary[900]};
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.16);
  cursor: pointer;

  /* 시안의 아이콘이 X라서 45도 돌려 +로 쓴다 */
  svg {
    transform: rotate(45deg);
  }
`;
