import type { FunctionComponent, SVGProps } from 'react';
import * as Styled from './FeedbackTag.styles';

interface FeedbackTagProps {
  label: string;
  backgroundColor: string;
  color: string;
  Icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

const FeedbackTag = ({
  label,
  backgroundColor,
  color,
  Icon,
}: FeedbackTagProps) => (
  <Styled.Tag $backgroundColor={backgroundColor} $color={color}>
    {Icon && (
      <Styled.IconBox>
        <Icon width={15} height={15} aria-hidden />
      </Styled.IconBox>
    )}
    {label}
  </Styled.Tag>
);

export default FeedbackTag;
