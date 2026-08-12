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
    {Icon && <Icon width={18} height={18} aria-hidden />}
    {label}
  </Styled.Tag>
);

export default FeedbackTag;
