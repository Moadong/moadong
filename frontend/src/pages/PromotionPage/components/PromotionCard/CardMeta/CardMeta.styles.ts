import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
`;

export const Icon = styled.div`
  width: 14px;
  height: 14px;
  padding: 1.5px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[500]};
`;

export const MetaText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray[600]};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
