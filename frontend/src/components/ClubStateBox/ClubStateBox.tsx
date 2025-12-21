import styled from 'styled-components';
import { STATUS_COLORS } from '@/styles/clubTags';

const STATE_TEXT: Record<string, string> = {
  OPEN: '모집중',
  CLOSED: '모집마감',
  ALWAYS: '상시모집',
} as const;

const BOX_DIMENSIONS = {
  desktop: {
    width: '66px',
    height: '28px',
  },
  mobile: {
    width: '50px',
    height: '25px',
  },
} as const;

const BOX_FONT_SIZE = {
  desktop: {
    fontSize: '0.875rem',
  },
  mobile: {
    fontSize: '0.75rem',
  },
} as const;

const StyledBox = styled.div<{ $backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  width: ${BOX_DIMENSIONS.desktop.width};
  height: ${BOX_DIMENSIONS.desktop.height};
  border-radius: 8px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ theme }) => theme.colors.base.white};
  font-size: ${BOX_FONT_SIZE.desktop.fontSize};
  font-weight: 500;

  @media (max-width: 500px) {
    width: ${BOX_DIMENSIONS.mobile.width};
    height: ${BOX_DIMENSIONS.mobile.height};
    font-size: ${BOX_FONT_SIZE.mobile.fontSize};
  }
`;

interface ClubStateBoxProps {
  state: string;
}

const ClubStateBox = ({ state }: ClubStateBoxProps) => {
  const text = STATE_TEXT[state] || '알 수 없음';
  const backgroundColor = STATUS_COLORS[text] || '#f5f5f5';

  return <StyledBox $backgroundColor={backgroundColor}>{text}</StyledBox>;
};

export default ClubStateBox;
