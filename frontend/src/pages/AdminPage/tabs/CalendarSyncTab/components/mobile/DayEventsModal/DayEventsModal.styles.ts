import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  max-width: calc(100vw - 48px);
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
  padding: 20px;
  border-radius: 16px;
  background: ${colors.base.white};
`;

export const DateLabel = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const TodayLabel = styled.span`
  margin-top: 2px;
  font-size: 0.75rem;
  color: ${colors.gray[600]};
`;

export const EventList = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EventItem = styled.li`
  list-style: none;
`;

export const EventCard = styled.div<{ $back: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  background: ${({ $back }) => $back};
`;

export const ColorDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const EventTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
  color: ${colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EventDate = styled.span`
  flex-shrink: 0;
  font-size: 0.82rem;
  color: ${colors.gray[600]};
`;

export const Empty = styled.p`
  margin: 16px 0 0;
  font-size: 0.92rem;
  color: ${colors.gray[600]};
  text-align: center;
`;

export const AddButton = styled.button`
  margin-top: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: ${colors.gray[100]};
  color: ${colors.gray[600]};
  font-size: 0.95rem;
  cursor: pointer;
`;
