import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const TitleSection = styled.div`
  gap: 6px;
`;

export const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
`;

export const Description = styled.span`
  display: block;
  min-width: 0;
  font-size: 14px;
  font-weight: 400;
  color: ${colors.gray[600]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
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
  font-weight: 400;
  color: ${colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
