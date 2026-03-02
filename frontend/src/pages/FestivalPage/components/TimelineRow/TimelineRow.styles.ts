import styled from 'styled-components';

type Status = 'past' | 'active' | 'upcoming';

const timeColor: Record<Status, string> = {
  past: '#989898',
  active: '#4b4b4b',
  upcoming: '#989898',
};

const lineColor: Record<Status, string> = {
  past: '#989898',
  active: '#ff5414',
  upcoming: '#a8a8a8',
};

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
  width: 100%;
`;

export const TimelineColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0;
  gap: 6px;
  flex-shrink: 0;
  width: 31px;
`;

export const TimeLabel = styled.span<{ $status: Status }>`
  font-size: 12px;
  font-weight: 600;
  line-height: 140%;
  color: ${({ $status }) => timeColor[$status]};
  white-space: nowrap;
`;

export const Line = styled.div<{ $status: Status }>`
  width: 2px;
  flex: 1;
  background-color: ${({ $status }) =>
    $status === 'upcoming' ? 'transparent' : lineColor[$status]};
  background-image: ${({ $status }) =>
    $status === 'upcoming'
      ? `repeating-linear-gradient(
          to bottom,
          ${lineColor.upcoming} 0px,
          ${lineColor.upcoming} 4px,
          transparent 4px,
          transparent 12px
        )`
      : 'none'};
  border-radius: 1px;
`;

export const CardColumn = styled.div`
  flex: 1;
  min-width: 0;
`;
