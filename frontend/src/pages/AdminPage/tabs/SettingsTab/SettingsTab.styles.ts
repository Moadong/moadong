import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import AdminIconSvg from '@/assets/images/icons/admin_icon.svg?react';
import RightArrowSvg from '@/assets/images/icons/right_arraw_icon.svg?react';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${colors.base.white};
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 57px;
  padding: 16px 20px;
  gap: 4px;
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

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 20px 0;
`;

export const ButtonSection = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px 50px;
`;

export const LogoutButton = styled.button`
  width: 100%;
  height: 50px;
  background: none;
  border: 1.5px solid ${colors.gray[200]};
  border-radius: 14px;
  cursor: pointer;
  ${setTypography(typography.paragraph.p2)}
  color: ${colors.gray[500]};

  &:active {
    background: ${colors.gray[100]};
  }
`;

export const NavigateButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 7px 20px;
  width: 100%;
  height: 50px;
  background: ${colors.primary[800]};
  border: none;
  border-radius: 14px;
  cursor: pointer;

  &:active {
    background: ${colors.primary[900]};
  }
`;

export const NavigateButtonLabel = styled.span`
  ${setTypography(typography.paragraph.p2)}
  line-height: 140%;
  letter-spacing: -0.02em;
  color: ${colors.base.white};
`;

export const RightArrowIcon = styled(RightArrowSvg)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  path {
    stroke: ${colors.base.white};
  }
`;

