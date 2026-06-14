import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

export const Overlay = styled.div`
  inset: 0;
  position: fixed;
  z-index: ${Z_INDEX.overlay};
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
`;

export const ContentWrapper = styled.div`
  position: relative;
  outline: none;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: fit-content;
`;

export const StandardLayout = styled.div<{ $width?: string }>`
  background: ${colors.base.white};
  border-radius: 10px;
  overflow: hidden;
  margin: 24px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  width: ${({ $width }) => $width || '400px'};
  max-width: 100%;
`;

export const Header = styled.div`
  padding: 30px;
  border-bottom: 1px solid ${colors.gray[400]};
  display: flex;
  align-items: center;
`;

export const Title = styled.h3`
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  text-align: left;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  font-size: 20px;
  font-weight: 800;
  color: ${colors.gray[600]};
  line-height: 1;
  cursor: pointer;
`;

export const Description = styled.p`
  padding: 20px 32px 0px;
  text-align: left;
  color: ${colors.gray[600]};
  font-weight: 600;
`;

export const Body = styled.div`
  padding: 16px 30px 30px;
  overflow: auto;
`;
