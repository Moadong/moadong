import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

export const ButtonArea = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0 24px;
  z-index: ${Z_INDEX.clubDetailFooter};
  background: ${colors.base.white};
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.16);

  ${media.tablet} {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    padding: 10px 20px calc(20px + env(safe-area-inset-bottom));
    background: transparent;
    box-shadow: none;
  }

  ${media.mobile} {
    left: 0;
    transform: none;
    max-width: 100%;
  }
`;

export const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${setTypography(typography.paragraph.p7)};
  color: ${colors.gray[500]};
`;

export const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${colors.primary[800]};
`;

export const StatusText = styled.span`
  color: ${colors.gray[600]};
  font-weight: 600;
`;

export const StatusDate = styled.span`
  color: ${colors.gray[500]};
  font-weight: 600;
`;

export const ChangePeriodButton = styled.button`
  width: 517px;
  height: 60px;
  border-radius: 14px;
  border: 1.5px solid ${colors.primary[800]};
  background: ${colors.base.white};
  ${setTypography(typography.title.title5)};
  color: ${colors.primary[800]};
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${colors.primary[500]};
  }

  ${media.tablet} {
    width: 100%;
    height: 50px;
    ${setTypography(typography.paragraph.p2)};
  }
`;
