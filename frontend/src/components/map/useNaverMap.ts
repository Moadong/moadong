import { useEffect } from 'react';
import markerIcon from '@/assets/images/icons/marker.svg';
import { loadNaverMapScript } from './loadNaverMapScript';

export const useNaverMap = (
  mapRef: React.RefObject<HTMLDivElement | null>,
  lat: number,
  lng: number,
) => {
  useEffect(() => {
    loadNaverMapScript().then(() => {
      if (!mapRef.current || !window.naver) return;

      const { naver } = window;

      const position = new naver.maps.LatLng(lat, lng);

      const map = new naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 17,
        logoControl: false,
        mapDataControl: false,
        scaleControl: false,
      });

      new naver.maps.Marker({
        position,
        map,
        icon: {
          url: markerIcon,
          scaledSize: new naver.maps.Size(30, 30),
          anchor: new naver.maps.Point(16, 25),
        },
      });
    });
  }, [mapRef, lat, lng]);
};
