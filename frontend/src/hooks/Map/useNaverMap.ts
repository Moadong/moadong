import { RefObject, useEffect, useRef } from 'react';
import markerIcon from '@/assets/images/icons/marker.svg';
import { colors } from '@/styles/theme/colors';
import { loadNaverMapScript } from '@/utils/loadNaverMapScript';
import { NaverMapInstance } from './useMapZoom';

interface UseNaverMapOptions {
  active?: boolean;
  interactive?: boolean;
  markerSize?: number;
  /** 마커를 찍을지. 좌표가 아직 확정되지 않은 화면에서 지도만 먼저 보여줄 때 false */
  showMarker?: boolean;
  bubbleText?: string;
  bubbleFontSize?: number;
  bubbleFontWeight?: number;
  mapInstanceRef?: RefObject<NaverMapInstance | null>;
  /**
   * 사용자가 지도를 직접 움직여 중심이 바뀌었을 때만 부른다.
   * setCenter 같은 프로그램 이동은 부르지 않는다 (호출부가 이미 아는 값이라
   * 되돌려 주면 상태가 순환한다).
   * 지도는 생성 시점의 콜백을 계속 쓰므로 렌더마다 새 함수를 넘겨도 지도를 다시 만들지 않는다.
   */
  onCenterChange?: (lat: number, lng: number) => void;
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
    showMarker = true,
    bubbleText,
    bubbleFontSize,
    bubbleFontWeight,
    mapInstanceRef: externalRef,
    onCenterChange,
  } = options ?? {};

  const onCenterChangeRef = useRef(onCenterChange);
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    if (!active) return;

    let mapInstance: NaverMapInstance | null = null;
    let isCleaned = false;

    loadNaverMapScript().then(() => {
      if (isCleaned || !mapRef.current || !window.naver) return;

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

      if (onCenterChangeRef.current) {
        const emitCenter = () => {
          const center = mapInstance?.getCenter();
          if (center) onCenterChangeRef.current?.(center.lat(), center.lng());
        };
        naver.maps.Event.addListener(mapInstance, 'dragend', emitCenter);
        naver.maps.Event.addListener(mapInstance, 'zoom_changed', emitCenter);
      }

      if (showMarker) {
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
      }
    });

    return () => {
      isCleaned = true;
      try {
        mapInstance?.destroy();
      } catch {
        // noop
      }
      if (externalRef) externalRef.current = null;
    };
  }, [
    mapRef,
    lat,
    lng,
    active,
    interactive,
    markerSize,
    showMarker,
    bubbleText,
    bubbleFontSize,
    bubbleFontWeight,
    externalRef,
  ]);
};
