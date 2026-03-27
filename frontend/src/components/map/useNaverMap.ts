import { useEffect } from 'react';
import { loadNaverMapScript } from './loadNaverMapScript';

export const useNaverMap = (
  mapRef: React.RefObject<HTMLDivElement | null>,
  lat: number,
  lng: number,
  clubName: string,
  building: string,
  detailLocation: string,
) => {
  useEffect(() => {
    loadNaverMapScript().then(() => {
      if (!mapRef.current || !window.naver) return;

      const { naver } = window;

      const position = new naver.maps.LatLng(lat, lng);

      const map = new naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 16,
      });

      const marker = new naver.maps.Marker({
        position,
        map,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `
          <div style="padding:10px;">
            <b>${clubName}</b><br/>
            ${building} ${detailLocation}
          </div>
        `,
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
    });
  }, [mapRef, lat, lng, clubName, building, detailLocation]);
};