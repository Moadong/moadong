import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 375px;
  background-color: #ffffff;
  border-radius: 20px;
  overflow: hidden;

  ${media.tablet} {
    max-width: none;
  }
`;

export const CoverImage = styled.img`
  width: 100%;
  height: 213px;
  position: relative;
  z-index: 1;
  object-fit: cover;
`;

export const LogoWrapper = styled.div`
  position: absolute;
  top: 165px;
  left: 16px;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background-color: #ffffff;
  padding: 2px;
  z-index: 3;
`;

export const Logo = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  border: 0.5px solid var(--Gray-400, #dcdcdc);
`;

export const Content = styled.div`
  padding: 42px 20px 20px;
  margin-top: -20px;
  position: relative;
  z-index: 2;
  background-color: #f5f5f5;
  border-radius: 20px;

  ${media.tablet} {
    background-color: #ffffff;
  }

  ${media.laptop} {
    padding: 40px 16px 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const ClubName = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.base.black};

  ${media.laptop} {
    font-size: 28px;
  }
  ${media.mobile} {
    font-size: 22px;
  }
`;

export const RecruitmentBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${colors.accent[1][700]};
  color: ${colors.accent[1][900]};
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;

  ${media.laptop} {
    font-size: 11px;
    padding: 3px 8px;
  }
`;

export const SocialLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

export const SocialIcon = styled.img`
  width: 14px;
  height: 14px;
`;

export const SocialLinkItem = styled.a`
  padding: 2px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  color: ${colors.gray[700]};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${colors.base.black};
  }

  ${media.mobile} {
    font-size: 12px;
  }
`;

export const SocialText = styled.span`
  word-break: break-all;
`;

export const SocialUrl = styled.span`
  color: #0066cc;
`;

export const IntroSection = styled.section`
  padding: 16px;
  border-radius: 14px;
  background-color: #ffffff;

  ${media.tablet} {
    background-color: #f5f5f5;
  }
`;

export const IntroTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.base.black};
  margin-bottom: 6px;
`;

export const IntroDescription = styled.p`
  font-size: 14px;
  color: ${colors.gray[800]};

  ${media.mobile} {
    font-size: 12px;
  }
`;
