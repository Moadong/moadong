import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-top: 100px;
  margin-bottom: 40px;
  text-align: center;
  color: ${colors.base.black};

  ${media.mobile} {
    font-size: 2rem;
  }
`;

export const IntroductionText = styled.p`
  ${setTypography(typography.paragraph.p1)}
  line-height: 1.4;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${colors.gray[800]};
  margin: 0 auto 28px;

  ${media.mobile} {
    margin-bottom: 20px;
  }
`;

export const SnsLinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 60px;

  ${media.mobile} {
    gap: 12px;
    margin-bottom: 40px;
  }
`;

export const SnsLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 100px;
  background-color: ${colors.gray[100]};
  color: ${colors.base.black};
  text-decoration: none;
  ${setTypography(typography.paragraph.p2)}
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e8e8e8;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

export const ProfileGrid = styled.div`
  display: flex;
  gap: 22px;
  padding: 0 110px 80px;
  align-items: flex-start;

  ${media.laptop} {
    padding: 0 40px 60px;
    gap: 16px;
  }

  ${media.tablet} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 0 24px 40px;
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
    padding: 0 16px 32px;
  }
`;

export const ProfileColumn = styled.div<{ $staggered: boolean }>`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 22px;
  padding-top: ${({ $staggered }) => ($staggered ? '125px' : '0')};

  ${media.tablet} {
    padding-top: 0;
    flex: none;
    width: 100%;
    gap: 16px;
  }
`;

export const ProfileCard = styled.div<{ $bgColor: string }>`
  position: relative;
  height: 250px;
  border-radius: 20px;
  padding: 40px 0 40px 25px;
  background-color: ${({ $bgColor }) => $bgColor};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 15px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      129deg,
      rgba(255, 255, 255, 0.7) 50.77%,
      rgba(255, 255, 255, 0.3) 87.48%
    );
    pointer-events: none;
    z-index: 1;
  }

  ${media.laptop} {
    height: 220px;
    padding: 30px 0 30px 20px;
  }

  ${media.tablet} {
    height: 180px;
    padding: 24px 0 24px 18px;
    gap: 10px;
  }

  ${media.mobile} {
    height: 160px;
    padding: 20px 0 20px 16px;
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 2;
`;

export const CardTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const CardName = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.base.black};
  letter-spacing: -0.4px;
  line-height: 1.4;
  margin: 0;
  white-space: nowrap;

  ${media.tablet} {
    font-size: 1rem;
  }
`;

export const CardRoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  padding: 2px 10px;
  border-radius: 15px;
  background-color: ${colors.gray[800]};
  color: ${colors.gray[100]};
  font-size: 1rem;
  font-weight: 700;
  align-self: flex-start;
  line-height: 1.4;
  white-space: nowrap;

  ${media.tablet} {
    font-size: 0.8rem;
  }
`;

export const CardDescription = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.gray[700]};
  letter-spacing: -0.32px;
  line-height: 1.4;
  margin: 0;
  white-space: pre-line;

  ${media.laptop} {
    font-size: 0.875rem;
  }

  ${media.tablet} {
    font-size: 0.75rem;
  }
`;

export const CardIllustrationWrap = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 60%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  overflow: hidden;
`;

export const CardIllustration = styled.img`
  width: 160px;
  height: 160px;
  object-fit: contain;

  ${media.laptop} {
    width: 120px;
    height: 120px;
  }

  ${media.tablet} {
    width: 120px;
    height: 120px;
  }

  ${media.mobile} {
    width: 80px;
    height: 80px;
  }
`;
