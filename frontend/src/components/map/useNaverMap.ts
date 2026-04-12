import { useEffect } from 'react';
import markerIcon from '@/assets/images/icons/marker.svg';
import { loadNaverMapScript } from './loadNaverMapScript';

interface UseNaverMapOptions {
  bubbleText?: string;
  interactive?: boolean;
}

export const useNaverMap = (
  mapRef: React.RefObject<HTMLDivElement | null>,
  lat: number,
  lng: number,
  options?: UseNaverMapOptions,
) => {
  useEffect(() => {
    loadNaverMapScript().then(() => {
      if (!mapRef.current || !window.naver) return;

      const { naver } = window;

      const position = new naver.maps.LatLng(lat, lng);

      const interactive = options?.interactive ?? true;

      const map = new naver.maps.Map(mapRef.current, {
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

      const markerContent = options?.bubbleText
        ? `
          <div style="position: relative; display: inline-block;">
            <div style="
              position: absolute;
              bottom: calc(40px + 5px);
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
                font-size: 13px;
                font-weight: 700;
                color: #111827;
                white-space: nowrap;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              ">${options.bubbleText}</div>
              <div style="
                width: 0;
                height: 0;
                border-left: 9px solid transparent;
                border-right: 9px solid transparent;
                border-top: 10px solid #fff;
                margin-top: -2px;
              "></div>
            </div>
            <img src="${markerIcon}" style="width: 40px; height: 40px; display: block;" />
          </div>
        `
        : `<img src="${markerIcon}" style="width: 40px; height: 40px;" />`;

      new naver.maps.Marker({
        position,
        map,
        icon: {
          content: markerContent,
          anchor: new naver.maps.Point(20, 40),
        },
      });
    });
  }, [mapRef, lat, lng, options?.interactive, options?.bubbleText]);
};
