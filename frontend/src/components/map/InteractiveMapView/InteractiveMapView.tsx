import { RefObject, useCallback, useEffect, useRef } from 'react';
import markerIcon from '@/assets/images/icons/marker.svg';
import MapClubInfoCard from '@/components/map/MapClubInfoCard/MapClubInfoCard';
import { ClubLocation } from '@/constants/clubLocation';
import { NaverMapInstance } from '@/hooks/Map/useMapZoom';
import { colors } from '@/styles/theme/colors';
import { loadNaverMapScript } from '@/utils/loadNaverMapScript';
import * as Styled from './InteractiveMapView.styles';

interface InteractiveMapViewProps {
  location: ClubLocation;
  clubName: string;
  clubLogo?: string;
  active: boolean;
  markerSize?: number;
  bubbleFontSize?: number;
  bubbleFontWeight?: number;
  mapInstanceRef?: RefObject<NaverMapInstance | null>;
}

const InteractiveMapView = ({
  location,
  clubName,
  clubLogo,
  active,
  markerSize = 40,
  bubbleFontSize = 13,
  bubbleFontWeight = 700,
  mapInstanceRef: externalMapRef,
}: InteractiveMapViewProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const internalMapRef = useRef<NaverMapInstance | null>(null);
  const mapInstanceRef = externalMapRef || internalMapRef;

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      loadNaverMapScript().then(() => {
        if (!mapRef.current || !window.naver) return;

        const { naver } = window;
        const position = new naver.maps.LatLng(location.lat, location.lng);

        mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
          center: position,
          zoom: 17,
          logoControl: false,
          mapDataControl: false,
          scaleControl: false,
        });

        const markerContent = `
          <div style="position: relative; display: inline-block;">
            <div style="
              position: absolute;
              bottom: calc(${markerSize}px + 5px);
              left: 50%;
              transform: translateX(-50%);
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                background: #fff;
                border-radius: 50px;
                padding: 10px 16px;
                font-size: ${bubbleFontSize}px;
                font-weight: ${bubbleFontWeight};
                color: ${colors.gray[900]};
                white-space: nowrap;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              ">동아리방</div>
              <div style="
                width: 0;
                height: 0;
                border-left: 9px solid transparent;
                border-right: 9px solid transparent;
                border-top: 10px solid #fff;
                margin-top: -2px;
              "></div>
            </div>
            <img src="${markerIcon}" style="width: ${markerSize}px; height: ${markerSize}px; display: block;" />
          </div>
        `;

        new naver.maps.Marker({
          position,
          map: mapInstanceRef.current,
          icon: {
            content: markerContent,
            anchor: new naver.maps.Point(markerSize / 2, markerSize),
          },
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, [
    active,
    location.lat,
    location.lng,
    markerSize,
    bubbleFontSize,
    bubbleFontWeight,
  ]);

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
