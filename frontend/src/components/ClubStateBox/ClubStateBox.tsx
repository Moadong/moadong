import styled from 'styled-components';

const stateStyles: Record<
  string,
  { backgroundColor: string; color: string; text: string }
> = {
  OPEN: {
    backgroundColor: 'rgba(0, 166, 255, 0.1)',
    color: '#00A6FF',
    text: '모집중',
  },
  UPCOMING: {
    backgroundColor: 'rgba(230, 247, 255, 1)',
    color: '#818181',
    text: '모집예정',
  },
  CLOSED: {
    backgroundColor: 'rgba(239, 239, 239, 0.8)',
    color: '#818181',
    text: '모집마감',
  },
};

const StyledBox = styled.div<{ bgColor: string; textColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  width: 83px;
  height: 30px;
  padding: 8px 21px;
  border-radius: 8px;
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor};
  font-size: 0.75rem;
  font-weight: 500;
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
    <StyledBox bgColor={style.backgroundColor} textColor={style.color}>
      {style.text}
    </StyledBox>
  );
};

export default ClubStateBox;
