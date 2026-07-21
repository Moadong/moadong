import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(1px);
`;

export const LoadingText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.gray[700]};
`;

export const Description = styled.p`
  font-size: 0.94rem;
  line-height: 1.5;
  color: ${colors.gray[600]};
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
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  padding: 0 12px;
  font-size: 0.9rem;
  color: ${colors.gray[900]};
  background: ${colors.base.white};
`;

export const TokenText = styled.code`
  display: block;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background: ${colors.gray[50]};
  font-size: 0.82rem;
  color: ${colors.gray[800]};
  word-break: break-all;
`;

export const StatusText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.accent[2][900]};
`;

export const ErrorText = styled.p`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #dc2626;
  font-weight: 600;
`;

export const DataCard = styled.div`
  border: 1px solid ${colors.gray[300]};
  border-radius: 12px;
  padding: 14px;
  background: ${colors.base.white};
`;

export const WideDataCard = styled(DataCard)`
  grid-column: 1 / -1;
`;

export const DataTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  & > h4 {
    margin: 0;
  }
`;

export const ProviderControls = styled.div`
  display: flex;
  gap: 8px;
`;

export const Empty = styled.p`
  font-size: 0.9rem;
  color: ${colors.gray[600]};
`;

export const ExternalLink = styled.a`
  color: ${colors.primary[900]};
`;

export const CalendarBoard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TogglePanel = styled.div`
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  padding: 10px;
  background: ${colors.gray[50]};
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
  color: ${colors.gray[900]};
`;

export const ToggleActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ToggleActionButton = styled.button`
  border: none;
  background: transparent;
  color: ${colors.primary[900]};
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
  color: ${colors.gray[800]};
`;

export const ToggleCheckbox = styled.input`
  width: 14px;
  height: 14px;
  accent-color: ${colors.primary[900]};
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
  color: ${colors.gray[900]};
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
  color: ${colors.gray[700]};
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

export const CalendarCell = styled.div<{ $muted: boolean }>`
  min-height: 120px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  padding: 8px;
  background: ${({ $muted }) => ($muted ? colors.gray[50] : colors.base.white)};
  opacity: ${({ $muted }) => ($muted ? 0.55 : 1)};
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover button[data-add],
  &:focus-within button[data-add] {
    display: block;
  }

  ${media.tablet} {
    min-height: 96px;
    padding: 6px;
  }
`;

export const AddEventButton = styled.button`
  display: none;
  width: 100%;
  height: 18px;
  border: none;
  border-radius: 6px;
  background: ${colors.primary[500]};
  color: ${colors.primary[900]};
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${colors.primary[600]};
  }
`;

export const CustomEvent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 6px;
  background: ${colors.primary[500]};
  overflow: hidden;

  &:hover {
    background: ${colors.primary[600]};
  }

  &:hover button[data-remove],
  &:focus-within button[data-remove] {
    display: flex;
  }
`;

export const CustomEventTitle = styled.button`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  line-height: 1.35;
  color: ${colors.primary[900]};
  padding: 4px 6px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CustomEventDelete = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.6);
  color: ${colors.primary[900]};
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

export const CalendarDayNumber = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${colors.gray[800]};
`;

export const CalendarEventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CalendarEvent = styled.div<{ $source?: 'GOOGLE' | 'NOTION' }>`
  position: relative;
  font-size: 0.8rem;
  line-height: 1.35;
  color: ${colors.gray[900]};
  padding: 4px 6px;
  border-radius: 6px;
  background: ${({ $source }) => {
    if ($source === 'GOOGLE') return colors.secondary[4].tag; // 구글 (파랑)
    if ($source === 'NOTION') return colors.secondary[6].tag; // 노션 (보라)
    return colors.gray[100];
  }};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover button[data-remove],
  &:focus-within button[data-remove] {
    display: flex;
  }
`;

export const OAuthEventRemove = styled.button`
  display: none;
  position: absolute;
  right: 3px;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.85);
  color: ${colors.gray[800]};
  font-size: 0.85rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${colors.base.white};
  }
`;

export const CalendarTitle = styled.span`
  font-size: 0.82rem;
  color: ${colors.gray[900]};
`;
