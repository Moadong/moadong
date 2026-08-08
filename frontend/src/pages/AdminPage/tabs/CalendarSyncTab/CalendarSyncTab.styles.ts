import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/**
 * 연동(Google·Notion) 데이터는 늦게 도착할 수 있어 화면을 가리지 않고
 * 헤더에만 진행 상태를 표시한다. 커스텀 일정은 먼저 보인다.
 */
export const SyncIndicator = styled.span`
  margin-right: auto;
  font-size: 0.85rem;
  color: ${colors.gray[600]};
`;

export const TokenText = styled.code`
  display: block;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background: ${colors.gray[50]};
  font-size: 0.82rem;
  color: ${colors.gray[800]};
  word-break: break-all;
`;

export const ErrorText = styled.p`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #dc2626;
  font-weight: 600;
`;

export const DataCard = styled.div`
  border-radius: 12px;
  padding: 14px;
  background: ${colors.base.white};
`;

export const WideDataCard = styled(DataCard)`
  grid-column: 1 / -1;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 10px;
`;
