import { useState } from 'react';
import LocationIcon from '@/assets/images/icons/location_icon.svg?react';
import MapModal from '@/components/map/MapModal/MapModal';
import NaverMap from '@/components/map/NaverMap/NaverMap';
import { ClubLocation } from '@/constants/clubLocation';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { PromotionArticle } from '@/types/promotion';
import * as Styled from './PromotionMapSection.styles';

interface Props {
  article: PromotionArticle;
}

const PromotionMapSection = ({ article }: Props) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const trackEvent = useMixpanelTrack();
  const { data: clubDetail } = useGetClubDetail(`@${article.clubName}`, {
    enabled: isMapModalOpen,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  if (article.latitude == null || article.longitude == null) {
    return null;
  }

  const location: ClubLocation = {
    clubName: article.clubName,
    lat: article.latitude,
    lng: article.longitude,
    building: article.location,
    detailLocation: '',
  };

  const handleMapClick = () => {
    trackEvent(USER_EVENT.PROMOTION_MAP_CLICKED, {
      promotion_id: article.id,
      club_name: article.clubName,
      location: article.location,
    });
    setIsMapModalOpen(true);
  };

  return (
    <>
      <Styled.Container>
        <Styled.MapCard onClick={handleMapClick}>
          <NaverMap location={location} />
        </Styled.MapCard>
        <Styled.LocationText>
          <LocationIcon />
          {article.location}
        </Styled.LocationText>
      </Styled.Container>

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        clubName={article.clubName}
        clubLogo={clubDetail?.logo}
        location={location}
        bubbleText='행사 위치'
      />
    </>
  );
};

export default PromotionMapSection;
