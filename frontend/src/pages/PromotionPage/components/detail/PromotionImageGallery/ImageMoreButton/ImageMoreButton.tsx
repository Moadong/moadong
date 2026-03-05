import * as Styled from './ImageMoreButton.styles';

interface Props {
  expanded: boolean;
  onClick: () => void;
}

const ImageMoreButton = ({ expanded, onClick }: Props) => {
  return (
    <Styled.Button onClick={onClick}>
      {expanded ? '접기 ▲' : '이미지 더보기 ▼'}
    </Styled.Button>
  );
};

export default ImageMoreButton;