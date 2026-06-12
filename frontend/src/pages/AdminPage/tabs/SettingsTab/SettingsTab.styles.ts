import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import AdminIconSvg from '@/assets/images/icons/admin_icon.svg?react';

export const Container = styled.div`
  min-height: 100%;
  background: ${colors.base.white};
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  gap: 4px;
  color: ${colors.gray[800]};
`;

export const PageTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  line-height: 140%;
  color: ${colors.gray[800]};
`;

export const AdminIcon = styled(AdminIconSvg)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;
