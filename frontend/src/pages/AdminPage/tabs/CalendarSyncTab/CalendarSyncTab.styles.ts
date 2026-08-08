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

export const Description = styled.p`
  font-size: 0.94rem;
  line-height: 1.5;
  color: ${colors.gray[600]};
`;

export const Buttons = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SelectRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  min-width: 240px;
  height: 42px;
  border: 1px solid ${colors.gray[300]};
  border-radius: 10px;
  padding: 0 12px;
  font-size: 0.9rem;
  color: ${colors.gray[900]};
  background: ${colors.base.white};
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

export const StatusText = styled.p`
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.accent[2][900]};
`;

export const DataErrorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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

export const ProviderControls = styled.div`
  display: flex;
  gap: 8px;
`;
