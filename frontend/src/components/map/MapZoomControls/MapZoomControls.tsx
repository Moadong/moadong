import * as Styled from './MapZoomControls.styles';

interface MapZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapZoomControls = ({ onZoomIn, onZoomOut }: MapZoomControlsProps) => {
  return (
    <Styled.Container>
      <Styled.Button onClick={onZoomIn} aria-label='확대'>
        <Styled.PlusIcon />
      </Styled.Button>
      <Styled.Divider />
      <Styled.Button onClick={onZoomOut} aria-label='축소'>
        <Styled.MinusIcon />
      </Styled.Button>
    </Styled.Container>
  );
};

export default MapZoomControls;
