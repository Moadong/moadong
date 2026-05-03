import { RefObject, useCallback, useRef } from 'react';
import MapClubInfoCard from '@/components/map/MapClubInfoCard/MapClubInfoCard';
import { ClubLocation } from '@/constants/clubLocation';
import { NaverMapInstance } from '@/hooks/Map/useMapZoom';
import { useNaverMap } from '@/hooks/Map/useNaverMap';
import * as Styled from './InteractiveMapView.styles';

interface InteractiveMapViewProps {
  location: ClubLocation;
  clubName: string;
  clubLogo?: string;
  active: boolean;
  markerSize?: number;
  bubbleFontSize?: number;
  bubbleFontWeight?: number;
  mapInstanceRef: RefObject<NaverMapInstance | null>;
}

const InteractiveMapView = ({
  location,
  clubName,
  clubLogo,
  active,
  markerSize = 40,
  bubbleFontSize = 13,
  bubbleFontWeight = 700,
  mapInstanceRef,
}: InteractiveMapViewProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useNaverMap(mapRef, location.lat, location.lng, {
    active,
    interactive: true,
    markerSize,
    bubbleText: '동아리방',
    bubbleFontSize,
    bubbleFontWeight,
    mapInstanceRef,
  });

  const handleRecenter = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map && window.naver) {
      map.setCenter(new window.naver.maps.LatLng(location.lat, location.lng));
    }
  }, [mapInstanceRef, location.lat, location.lng]);

  return (
    <Styled.Container>
      <Styled.MapArea ref={mapRef} />
      <Styled.InfoCardWrapper onClick={handleRecenter}>
        <MapClubInfoCard
          logo={clubLogo}
          name={clubName}
          building={location.building}
          detailLocation={location.detailLocation}
        />
      </Styled.InfoCardWrapper>
    </Styled.Container>
  );
};

export default InteractiveMapView;
