import styled from 'styled-components';
import { TAG_COLORS } from '@/styles/clubTags';

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

const StyledTag = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  padding: ${TAG_STYLES.desktop.padding};
  height: 28px;
  border-radius: ${TAG_STYLES.desktop.borderRadius};
  background-color: ${({ $color }) => $color};
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

const ClubTag = ({ type, children, className }: TagProps) => {
  const backgroundColor = TAG_COLORS[type] || 'rgba(237, 237, 237, 1)';
  return (
    <StyledTag
      $color={backgroundColor}
      className={className}
    >{`#${children || type}`}</StyledTag>
  );
};

export default ClubTag;
