import { useRef } from 'react';
import { useNaverMap } from '@/components/map/useNaverMap';
import * as Styled from './NaverMap.styles';

interface NaverMapProps {
  lat: number;
  lng: number;
  clubName: string;
  building: string;
  detailLocation: string;
}

const NaverMap = ({ lat, lng }: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useNaverMap(mapRef, lat, lng);

  return <Styled.MapContainer ref={mapRef} />;
};

export default NaverMap;
