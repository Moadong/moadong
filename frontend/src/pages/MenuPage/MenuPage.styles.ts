import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  background-color: #ffffff;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

export const MenuList = styled.div`
  padding-top: 8px;
`;

const itemStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border: none;
  border-bottom: 1px solid ${theme.colors.gray[100]};
  background: none;
  cursor: pointer;
  text-decoration: none;
`;

export const MenuItem = styled.button`
  ${itemStyles}
`;

export const MenuLink = styled.a`
  ${itemStyles}
`;

export const ItemLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconCircle = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.colors.primary[500]};
  color: ${theme.colors.primary[900]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ItemText = styled.span`
  font-size: 16px;
  color: #111111;
`;

export const Chevron = styled.span`
  display: flex;
  color: ${theme.colors.gray[500]};
`;

export const AppVersion = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${theme.colors.gray[400]};
  padding: 24px 0;
`;
