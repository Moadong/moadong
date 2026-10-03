import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

/**
 * 시안(11435:17403): 107px 정사각 3열, 가로·세로 간격 7px.
 * 1fr은 최소 크기가 min-content라 이미지 고유 폭이 컬럼을 밀어낸다. minmax(0, 1fr)이어야 줄어든다.
 */
export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  list-style: none;
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

  /* 22px은 손가락으로 누르기에 작다. 시안 크기는 두고 히트 영역만 넓힌다 */
  &::after {
    content: '';
    position: absolute;
    inset: -11px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/** 시안에 없는 상태라 활동사진 편집(ImageSortGrid)의 오버레이를 썸네일 모양에 맞춰 옮겼다 */
export const Overlay = styled.div<{ $error?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  background: ${({ $error }) =>
    $error ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
`;

export const StatusText = styled.span`
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};
`;

export const RetryButton = styled.button`
  padding: 4px 12px;
  border: 1.5px solid ${colors.base.white};
  border-radius: 6px;
  background: transparent;
  ${setTypography(typography.button.button2)}
  color: ${colors.base.white};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
