import CloseButtonIcon from '@/assets/images/icons/close_button_icon.svg?react';
import PrevButtonIcon from '@/assets/images/icons/prev_button_icon.svg?react';
import PortalModal from '@/components/common/Modal/PortalModal';
import InteractiveMapView from '@/components/map/InteractiveMapView/InteractiveMapView';
import { ClubLocation } from '@/constants/clubLocation';
import useDevice from '@/hooks/useDevice';
import * as Styled from './ClubMapModal.styles';

interface ClubMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
  clubLogo?: string;
  location: ClubLocation;
}

const ClubMapModal = ({
  isOpen,
  onClose,
  clubName,
  clubLogo,
  location,
}: ClubMapModalProps) => {
  const { isMobile, isTablet } = useDevice();
  const isMobileView = isMobile || isTablet;

  return (
    <PortalModal isOpen={isOpen} onClose={onClose}>
      <Styled.Container>
        <InteractiveMapView
          location={location}
          clubName={clubName}
          clubLogo={clubLogo}
          active={isOpen}
          markerSize={40}
          bubbleFontSize={13}
        />

        <Styled.ActionButton onClick={onClose} aria-label={isMobileView ? '뒤로가기' : '닫기'}>
          {isMobileView ? (
            <PrevButtonIcon width={30} height={30} />
          ) : (
            <CloseButtonIcon width={20} height={20} />
          )}
        </Styled.ActionButton>
      </Styled.Container>
    </PortalModal>
  );
};

export default ClubMapModal;
