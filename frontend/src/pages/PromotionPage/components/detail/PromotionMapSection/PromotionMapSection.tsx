import { useState } from 'react';
import NaverMap from '@/components/map/NaverMap/NaverMap';
import MapModal from '@/components/map/MapModal/MapModal';
import LocationIcon from '@/assets/images/icons/location_icon.svg?react';
import { ClubLocation } from '@/constants/clubLocation';
import { PromotionArticle } from '@/types/promotion';
import * as Styled from './PromotionMapSection.styles';

interface Props {
  article: PromotionArticle;
}

const PromotionMapSection = ({ article }: Props) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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

  return (
    <>
      <Styled.Container>
        <Styled.MapCard onClick={() => setIsMapModalOpen(true)}>
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
        location={location}
        bubbleText="행사 위치"
      />
    </>
  );
};

export default PromotionMapSection;
