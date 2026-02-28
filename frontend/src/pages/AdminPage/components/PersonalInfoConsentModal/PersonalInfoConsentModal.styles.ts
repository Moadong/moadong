import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  background: ${colors.base.white};
  border-radius: 16px;
  padding: 40px 36px 32px;
  width: 560px;
  max-width: calc(100vw - 48px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 800;
  color: ${colors.base.black};
  margin-bottom: 6px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${colors.gray[600]};
  margin-bottom: 28px;
`;

export const GuideList = styled.ul`
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GuideItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.gray[800]};
`;

export const GuideIcon = styled.span`
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1.4;
`;

export const Footer = styled.p`
  font-size: 12px;
  color: ${colors.gray[500]};
  margin-bottom: 20px;
`;
