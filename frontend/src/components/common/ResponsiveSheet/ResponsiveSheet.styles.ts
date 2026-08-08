import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

/** 데스크탑에서 모달로 열릴 때의 카드. 바텀시트가 하던 역할을 대신한다. */
export const DesktopCard = styled.div<{ $background?: string }>`
  width: 360px;
  max-width: calc(100vw - 48px);
  max-height: calc(100dvh - 120px);
  overflow-y: auto;
  padding: 20px;
  border-radius: 16px;
  background: ${({ $background }) => $background ?? colors.base.white};
`;
