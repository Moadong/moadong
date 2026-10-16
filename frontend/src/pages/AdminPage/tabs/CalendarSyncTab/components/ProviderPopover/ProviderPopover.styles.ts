import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Root = styled.div`
  position: relative;
  display: inline-flex;
`;

export const IconButton = styled.button<{ $connected: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 9px;
  background: ${colors.base.white};
  cursor: pointer;
  opacity: ${({ $connected }) => ($connected ? 1 : 0.45)};
  filter: ${({ $connected }) => ($connected ? 'none' : 'grayscale(1)')};
  transition:
    opacity 0.15s,
    background 0.15s;

  &:hover {
    background: ${colors.gray[100]};
    opacity: 1;
    filter: none;
  }
`;

export const StatusDot = styled.span<{ $connected: boolean }>`
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 2px solid ${colors.base.white};
  background: ${({ $connected }) =>
    $connected ? colors.accent[2][900] : colors.gray[400]};
`;

export const DisconnectBadge = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 1.5px solid ${colors.base.white};
  border-radius: 50%;
  background: #dc2626;
  color: ${colors.base.white};
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }
`;

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 240px;
  padding: 14px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 12px;
  background: ${colors.base.white};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* 팝오버 안에서는 공용 Button/Select를 작게 */
  & button {
    height: 32px;
    padding: 0 12px;
    font-size: 0.82rem;
    border-radius: 8px;
  }

  & select {
    height: 32px;
    min-width: 0;
    width: 100%;
    font-size: 0.82rem;
  }
`;
