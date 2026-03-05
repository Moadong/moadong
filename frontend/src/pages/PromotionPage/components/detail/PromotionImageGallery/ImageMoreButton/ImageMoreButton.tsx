import ArrowIcon from '@/assets/images/icons/more_arraw_icon.svg?react';
import * as Styled from './ImageMoreButton.styles';

interface Props {
  expanded: boolean;
  onClick: () => void;
}

const ImageMoreButton = ({ expanded, onClick }: Props) => {
  return (
    <Styled.Button onClick={onClick}>
      <Styled.Content>
        이미지 {expanded ? '접기' : '더보기'}
        <Styled.Arrow $expanded={expanded}>
          <ArrowIcon width={14} height={14} />
        </Styled.Arrow>
      </Styled.Content>
    </Styled.Button>
  );
};

export default ImageMoreButton;