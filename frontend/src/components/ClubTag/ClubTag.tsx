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
  className?: string;
}

const TAG_STYLES = {
  desktop: {
    padding: '4px 8px',
    borderRadius: '8px',
  },
  mobile: {
    padding: '4px 8px',
    borderRadius: '6px',
  },
} as const;

const TAG_FONT_SIZE = {
  desktop: {
    fontSize: '0.875rem',
  },
  mobile: {
    fontSize: '0.75rem',
  },
} as const;

const StyledTag = styled.span<{ color: string }>`
  display: flex;
  align-items: center;
  padding: ${TAG_STYLES.desktop.padding};
  height: 28px;
  border-radius: ${TAG_STYLES.desktop.borderRadius};
  background-color: ${({ color }) => color};
  font-size: ${TAG_FONT_SIZE.desktop.fontSize};
  font-weight: 600;
  color: #3a3a3a;

  @media (max-width: 500px) {
    height: 25px;
    font-size: ${TAG_FONT_SIZE.mobile.fontSize};
    padding: ${TAG_STYLES.mobile.padding};
    border-radius: ${TAG_STYLES.mobile.borderRadius};
  }
`;
``;

const ClubTag = ({ type, children, className }: TagProps) => {
  const backgroundColor = TagColors[type] || 'rgba(237, 237, 237, 1)';
  return (
    <StyledTag
      color={backgroundColor}
      className={className}
    >{`#${children || type}`}</StyledTag>
  );
};

export default ClubTag;
