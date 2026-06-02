import { useRef } from 'react';
import { useNaverMap } from '@/hooks/Map/useNaverMap';
import * as Styled from './NaverMap.styles';

interface NaverMapProps {
  location: { lat: number; lng: number };
}

const NaverMap = ({ location }: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useNaverMap(mapRef, location.lat, location.lng, { interactive: false });

  return <Styled.MapContainer ref={mapRef} />;
};

export default NaverMap;
