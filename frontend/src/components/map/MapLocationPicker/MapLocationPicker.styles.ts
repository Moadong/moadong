import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

/**
 * 네이버 지도는 내부 레이어에 z-index를 10000까지 쓴다. 여기서 스태킹 컨텍스트를
 * 만들어 그 값들을 가둬야 핀·덮개가 확실히 위에 남는다.
 */
export const MapArea = styled.div`
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

/**
 * 지도 한가운데 고정된 핀. 지도를 끌어 핀에 위치를 맞추는 방식이라
 * 핀 자체는 움직이지 않는다. 아래쪽 끝이 지도 중심에 오도록 bottom을 50%로 둔다.
 * (배경 이미지로 두면 안 된다. marker.svg는 data URI로 인라인되는데 그 안의
 * 작은따옴표 때문에 url() 파싱이 깨져 선언이 통째로 버려진다.)
 */
export const CenterPin = styled.img<{ $isConfirmed: boolean }>`
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: 50%;
  width: 40px;
  height: 40px;
  transform: translateX(-50%);
  opacity: ${({ $isConfirmed }) => ($isConfirmed ? 1 : 0.4)};
  pointer-events: none;
`;

/** 폼이 비활성일 때 지도 조작만 막는다. 지도를 다시 만들지 않으려고 덮개로 처리한다 */
export const Blocker = styled.div`
  position: absolute;
  z-index: 2;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
`;
