import styled from 'styled-components';

const STATE_COLORS = {
  OPEN: {
    backgroundColor: '#3DBBFF',
    textColor: '#FFFFFF',
  },
  CLOSED: {
    backgroundColor: '#C5C5C5',
    textColor: '#FFFFFF',
  },
  ALWAYS: {
    backgroundColor: '#49D5AD',
    textColor: '#FFFFFF',
  },
};

const stateStyles: Record<
  string,
  { backgroundColor: string; color: string; text: string }
> = {
  OPEN: {
    backgroundColor: STATE_COLORS.OPEN.backgroundColor,
    color: STATE_COLORS.OPEN.textColor,
    text: '모집중',
  },
  CLOSED: {
    backgroundColor: STATE_COLORS.CLOSED.backgroundColor,
    color: STATE_COLORS.CLOSED.textColor,
    text: '모집마감',
  },
  ALWAYS: {
    backgroundColor: STATE_COLORS.ALWAYS.backgroundColor,
    color: STATE_COLORS.ALWAYS.textColor,
    text: '상시모집',
  },
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

const StyledBox = styled.div<{ $bgColor: string; $textColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  width: ${BOX_DIMENSIONS.desktop.width};
  height: ${BOX_DIMENSIONS.desktop.height};
  border-radius: 8px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  font-size: 0.75rem;
  font-weight: 500;

  @media (max-width: 500px) {
    width: ${BOX_DIMENSIONS.mobile.width};
    height: ${BOX_DIMENSIONS.mobile.height};
  }
`;

interface ClubStateBoxProps {
  state: string;
}

const ClubStateBox = ({ state }: ClubStateBoxProps) => {
  const style = stateStyles[state] || {
    backgroundColor: '#f5f5f5',
    color: '#000',
    text: '알 수 없음',
  };

  return (
    <StyledBox $bgColor={style.backgroundColor} $textColor={style.color}>
      {style.text}
    </StyledBox>
  );
};

export default ClubStateBox;
