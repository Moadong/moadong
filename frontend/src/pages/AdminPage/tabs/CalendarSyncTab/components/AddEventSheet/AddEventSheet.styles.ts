import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/**
 * 저장 버튼은 연동 목록이 길어져도 항상 보이도록 시트 하단에 고정한다.
 * 시트(BottomSheet)·카드(DesktopCard) 패딩이 20px이라, 좌우 -20px로 영역을
 * 시트 폭까지 넓히고 아래 -20px(고정 위치·흐름 위치 모두)로 시트 하단
 * 패딩을 상쇄해 버튼 아래 여백이 이 영역의 20px만 남게 한다.
 */
const SHEET_PADDING_BOTTOM = 'calc(-20px - env(safe-area-inset-bottom))';

export const SaveArea = styled.div`
  position: sticky;
  bottom: ${SHEET_PADDING_BOTTOM};
  margin: 0 -20px ${SHEET_PADDING_BOTTOM};
  padding: 10px 24px calc(20px + env(safe-area-inset-bottom));
  background: ${colors.gray[100]};
`;

export const MonthLabel = styled.h4`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${colors.gray[900]};
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #dc2626;
`;

export const SaveButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: ${colors.primary[900]};
  color: ${colors.base.white};
  transition: background 0.15s;

  &:disabled {
    background: ${colors.gray[300]};
    color: ${colors.gray[600]};
    cursor: not-allowed;
  }
`;
