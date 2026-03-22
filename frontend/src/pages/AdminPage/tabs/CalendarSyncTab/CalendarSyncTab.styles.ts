import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Description = styled.p`
  font-size: 0.94rem;
  line-height: 1.5;
  color: #4b5563;
`;

export const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Block = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
`;

export const BlockTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 700;
`;

export const Buttons = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SelectRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  min-width: 240px;
  height: 42px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 0.9rem;
  color: #111827;
  background: #ffffff;
`;

export const TokenText = styled.code`
  display: block;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.82rem;
  color: #1f2937;
  word-break: break-all;
`;

export const StatusText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f766e;
`;

export const ErrorText = styled.p`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #b91c1c;
  font-weight: 600;
`;

export const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DataCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #ffffff;
`;

export const WideDataCard = styled(DataCard)`
  grid-column: 1 / -1;
`;

export const DataTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 700;
`;

export const Empty = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
`;

export const List = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItem = styled.li`
  font-size: 0.92rem;
  color: #111827;
  line-height: 1.45;
`;

export const ExternalLink = styled.a`
  color: #1d4ed8;
`;

export const CalendarBoard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TogglePanel = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
`;

export const ToggleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ToggleTitle = styled.h6`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
`;

export const ToggleActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ToggleActionButton = styled.button`
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

export const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
`;

export const ToggleItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: #374151;
`;

export const ToggleCheckbox = styled.input`
  width: 14px;
  height: 14px;
`;

export const ToggleText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const CalendarMonth = styled.h5`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
`;

export const CalendarWeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

export const CalendarWeekCell = styled.div`
  text-align: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: #4b5563;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

export const CalendarCell = styled.div<{ $muted: boolean }>`
  min-height: 120px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px;
  background: ${({ $muted }) => ($muted ? '#f9fafb' : '#ffffff')};
  opacity: ${({ $muted }) => ($muted ? 0.55 : 1)};
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    min-height: 96px;
    padding: 6px;
  }
`;

export const CalendarDayNumber = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
`;

export const CalendarEventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CalendarEvent = styled.div`
  font-size: 0.8rem;
  line-height: 1.35;
  color: #111827;
  padding: 4px 6px;
  border-radius: 6px;
  background: #eff6ff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CalendarTitle = styled.span`
  font-size: 0.82rem;
  color: #111827;
`;
