import ArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import * as Styled from './PromotionArrowButton.styles';

interface Props {
  text: string;
  direction?: 'down' | 'up' | 'right' | 'left';
  onClick: () => void;
}

const PromotionArrowButton = ({ text, direction = 'down', onClick }: Props) => {
  return (
    <Styled.Button onClick={onClick}>
      <Styled.Content>
        {text}
        <Styled.Arrow $direction={direction}>
          <ArrowIcon width={14} height={14} />
        </Styled.Arrow>
      </Styled.Content>
    </Styled.Button>
  );
};

export default PromotionArrowButton;
