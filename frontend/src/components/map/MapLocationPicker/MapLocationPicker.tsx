import { useEffect, useRef, useState } from 'react';
import markerIcon from '@/assets/images/icons/marker.svg';
import { NaverMapInstance } from '@/hooks/Map/useMapZoom';
import { useNaverMap } from '@/hooks/Map/useNaverMap';
import * as Styled from './MapLocationPicker.styles';

export interface PickedCoordinates {
  lat: number;
  lng: number;
}

interface MapLocationPickerProps {
  /** 확정된 좌표. 아직 고르지 않았으면 null */
  value: PickedCoordinates | null;
  /** value가 없을 때 지도를 띄울 기준 좌표 */
  fallbackCenter: PickedCoordinates;
  disabled?: boolean;
  onChange: (coordinates: PickedCoordinates) => void;
}

/**
 * 지도를 끌어 중앙 핀에 위치를 맞추는 좌표 선택기.
 * 미리 등록된 좌표 목록에 없는 장소도 지정할 수 있게 하는 게 목적이다.
 *
 * 지도는 처음 한 번만 만든다. value가 바뀔 때마다 다시 만들면
 * 드래그 → onChange → 재생성으로 방금 끈 거리가 되돌아간다.
 * 그래서 지도 밖에서 들어온 좌표 변경은 setCenter로만 반영한다.
 */
const MapLocationPicker = ({
  value,
  fallbackCenter,
  disabled = false,
  onChange,
}: MapLocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<NaverMapInstance | null>(null);
  const [initialCenter] = useState(() => value ?? fallbackCenter);
  /** 우리가 올려보낸 좌표. 그대로 되돌아온 것은 지도를 옮길 이유가 없다 */
  const lastEmittedRef = useRef<PickedCoordinates | null>(null);

  useNaverMap(mapRef, initialCenter.lat, initialCenter.lng, {
    interactive: true,
    showMarker: false,
    mapInstanceRef,
    onCenterChange: (lat, lng) => {
      lastEmittedRef.current = { lat, lng };
      onChange({ lat, lng });
    },
  });

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !value || !window.naver) return;

    const lastEmitted = lastEmittedRef.current;
    if (
      lastEmitted &&
      lastEmitted.lat === value.lat &&
      lastEmitted.lng === value.lng
    ) {
      return;
    }
    map.setCenter(new window.naver.maps.LatLng(value.lat, value.lng));
  }, [value]);

  return (
    <Styled.Container>
      <Styled.MapArea ref={mapRef} />
      <Styled.CenterPin
        src={markerIcon}
        alt=''
        aria-hidden
        $isConfirmed={value !== null}
      />
      {disabled && <Styled.Blocker />}
    </Styled.Container>
  );
};

export default MapLocationPicker;
