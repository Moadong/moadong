import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

export const ContactButton = styled.a`
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: ${Z_INDEX.floatingButton};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-width: 132px;
  height: 48px;
  padding: 0 16px;

  border-radius: 999px;
  background-color: #fee500;
  color: ${colors.base.black};
  box-shadow: 0 6px 18px rgb(0 0 0 / 16%);

  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    display: block;
  }

  svg path {
    fill: ${colors.base.black};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgb(0 0 0 / 20%);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid ${colors.primary[700]};
    outline-offset: 3px;
  }

  ${media.tablet} {
    right: 16px;
    bottom: calc(88px + env(safe-area-inset-bottom));

    width: 48px;
    min-width: 48px;
    padding: 0;
  }
`;

export const Label = styled.span`
  ${media.tablet} {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;
