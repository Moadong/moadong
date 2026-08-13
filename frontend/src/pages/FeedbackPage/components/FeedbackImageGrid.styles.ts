import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

/**
 * 시안(11435:17403): 107px 정사각 3열, 가로·세로 간격 7px.
 * 1fr은 최소 크기가 min-content라 이미지 고유 폭이 컬럼을 밀어낸다. minmax(0, 1fr)이어야 줄어든다.
 */
export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
`;

export const Item = styled.li`
  position: relative;
  aspect-ratio: 1;
`;

export const Thumbnail = styled.img`
  /* inline이면 baseline 여백 때문에 칸이 이미지보다 커진다 */
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  object-fit: cover;
`;

/** 시안: 썸네일 우상단에서 10px 떨어진 22px 원형 버튼 */
export const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${colors.gray[900]};
  cursor: pointer;
`;
