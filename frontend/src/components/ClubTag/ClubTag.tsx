import styled from 'styled-components';

const TagColors: Record<string, string> = {
  중동: 'rgba(230, 247, 255, 1)',
  봉사: 'rgba(255, 187, 187, 0.5)',
  종교: 'rgba(255, 230, 147, 0.5)',
  취미교양: 'rgba(159, 220, 214, 0.48)',
  학술: 'rgba(177, 189, 241, 0.5)',
  운동: 'rgba(253, 173, 60, 0.4)',
  공연: 'rgba(205, 241, 165, 0.5)',
  자유: 'rgba(237, 237, 237, 0.8)',
};

interface TagProps {
  type: string;
  children?: React.ReactNode;
}

const StyledTag = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${({ color }) => color};
  font-size: 0.875rem;
  font-weight: 600;
  color: #3a3a3a;
`;

const ClubTag = ({ type, children }: TagProps) => {
  const backgroundColor = TagColors[type] || 'rgba(237, 237, 237, 1)';
  return (
    <StyledTag color={backgroundColor}>{`#${children || type}`}</StyledTag>
  );
};

export default ClubTag;
