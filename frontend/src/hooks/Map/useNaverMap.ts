import { RefObject, useEffect } from 'react';
import markerIcon from '@/assets/images/icons/marker.svg';
import { colors } from '@/styles/theme/colors';
import { loadNaverMapScript } from '@/utils/loadNaverMapScript';
import { NaverMapInstance } from './useMapZoom';

interface UseNaverMapOptions {
  active?: boolean;
  interactive?: boolean;
  markerSize?: number;
  bubbleText?: string;
  bubbleFontSize?: number;
  bubbleFontWeight?: number;
  mapInstanceRef?: RefObject<NaverMapInstance | null>;
}

const buildMarkerContent = (
  markerSize: number,
  bubbleText?: string,
  bubbleFontSize = 13,
  bubbleFontWeight = 700,
): string => {
  const image = `<img src="${markerIcon}" style="width: ${markerSize}px; height: ${markerSize}px; display: block;" />`;

  if (!bubbleText) return image;

  return `
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
        ">${bubbleText}</div>
        <div style="
          width: 0;
          height: 0;
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-top: 10px solid #fff;
          margin-top: -2px;
        "></div>
      </div>
      ${image}
    </div>
  `;
};

export const useNaverMap = (
  mapRef: RefObject<HTMLDivElement | null>,
  lat: number,
  lng: number,
  options?: UseNaverMapOptions,
) => {
  const {
    active = true,
    interactive = true,
    markerSize = 40,
    bubbleText,
    bubbleFontSize,
    bubbleFontWeight,
    mapInstanceRef: externalRef,
  } = options ?? {};

  useEffect(() => {
    if (!active) return;

    let mapInstance: NaverMapInstance | null = null;

    loadNaverMapScript().then(() => {
      if (!mapRef.current || !window.naver) return;

      const { naver } = window;
      const position = new naver.maps.LatLng(lat, lng);

      mapInstance = new naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 17,
        logoControl: false,
        mapDataControl: false,
        scaleControl: false,
        draggable: interactive,
        scrollWheel: interactive,
        keyboardShortcuts: interactive,
        disableDoubleClickZoom: !interactive,
        pinchZoom: interactive,
      });

      if (externalRef) {
        externalRef.current = mapInstance;
      }

      new naver.maps.Marker({
        position,
        map: mapInstance,
        icon: {
          content: buildMarkerContent(
            markerSize,
            bubbleText,
            bubbleFontSize,
            bubbleFontWeight,
          ),
          anchor: new naver.maps.Point(markerSize / 2, markerSize),
        },
      });
    });

    return () => {
      mapInstance?.destroy();
      if (externalRef) externalRef.current = null;
    };
  }, [
    mapRef,
    lat,
    lng,
    active,
    interactive,
    markerSize,
    bubbleText,
    bubbleFontSize,
    bubbleFontWeight,
    externalRef,
  ]);
};
