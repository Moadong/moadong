import { useRef } from 'react';
import CloseButtonIcon from '@/assets/images/icons/close_button_icon.svg?react';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import PortalModal from '@/components/common/Modal/PortalModal';
import InteractiveMapView from '@/components/map/InteractiveMapView/InteractiveMapView';
import MapZoomControls from '@/components/map/MapZoomControls/MapZoomControls';
import { useMapZoom } from '@/hooks/Map/useMapZoom';
import { ClubLocation } from '@/constants/clubLocation';
import useDevice from '@/hooks/useDevice';
import * as Styled from './MapModal.styles';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
  clubLogo?: string;
  location: ClubLocation;
}

const MapModal = ({
  isOpen,
  onClose,
  clubName,
  clubLogo,
  location,
}: MapModalProps) => {
  const { isMobile, isTablet } = useDevice();
  const isMobileView = isMobile || isTablet;
  const mapInstanceRef = useRef<any>(null);
  const { zoomIn, zoomOut } = useMapZoom(mapInstanceRef);

  return (
    <PortalModal isOpen={isOpen} onClose={onClose}>
      <Styled.Container>
        <InteractiveMapView
          location={location}
          clubName={clubName}
          clubLogo={clubLogo}
          active={isOpen}
          mapInstanceRef={mapInstanceRef}
        />

        <Styled.ActionButton onClick={onClose} aria-label={isMobileView ? '뒤로가기' : '닫기'}>
          {isMobileView ? (
            <PrevButtonIcon width={30} height={30} />
          ) : (
            <CloseButtonIcon width={20} height={20} />
          )}
        </Styled.ActionButton>

        <Styled.ZoomControlsWrapper>
          <MapZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
        </Styled.ZoomControlsWrapper>
      </Styled.Container>
    </PortalModal>
  );
};

export default MapModal;
