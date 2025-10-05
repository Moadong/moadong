import styled from 'styled-components';

const stateStyles: Record<
  string,
  { backgroundColor: string; color: string; text: string }
> = {
  OPEN: {
    backgroundColor: '#3DBBFF',
    color: '#FFFFFF',
    text: '모집중',
  },
  CLOSED: {
    backgroundColor: '#C5C5C5',
    color: '#FFFFFF',
    text: '모집마감',
  },
  ALWAYS: {
    backgroundColor: '#49D5AD',
    color: '#FFFFFF',
    text: '상시모집',
  },
};

const StyledBox = styled.div<{ $bgColor: string; $textColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  width: 66px;
  height: 28px;
  border-radius: 8px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  font-size: 0.75rem;
  font-weight: 500;

  @media (max-width: 500px) {
    width: 50px;
    height: 25px;
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
