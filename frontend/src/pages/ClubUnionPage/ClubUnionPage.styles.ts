import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-top: 100px;
  margin-bottom: 40px;
  text-align: center;
  color: #222;

  ${media.mobile} {
    font-size: 2rem;
    margin-top: 80px;
    margin-bottom: 30px;
  }
`;

export const IntroductionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  text-align: center;
  color: #555;
  max-width: 600px;
  margin: 0 auto 20px;

  ${media.mobile} {
    font-size: 1rem;
    margin-bottom: 16px;
  }
`;

export const SnsLinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;

  ${media.mobile} {
    margin-bottom: 40px;
  }
`;

export const SnsLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 24px;
  background-color: #f5f5f5;
  color: #333;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #eaeaea;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

export const ProfileGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px 30px;
  max-width: 1050px;
  margin: 0 auto;
  padding-bottom: 80px;

  ${media.tablet} {
    gap: 30px 20px;
    padding-bottom: 60px;
  }

  ${media.mobile} {
    gap: 20px 15px;
    padding-bottom: 40px;
  }
`;

export const InfoOverlay = styled.div`
  position: absolute;
  inset: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
  box-sizing: border-box;
`;

export const ProfileImage = styled.img`
  width: 80%;
  height: 80%;
  object-fit: contain;
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
`;

export const NameBadge = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${colors.base.white};
  color: ${colors.base.black};
  padding: 3px 12px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  transition: opacity 0.3s ease;
  white-space: nowrap;

  ${media.mobile} {
    font-size: 0.8rem;
  }
`;

export const ProfileCardContainer = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: ${({ $bgColor }) => $bgColor};

  ${media.laptop} {
    width: 160px;
    height: 160px;
  }

  ${media.tablet} {
    width: 140px;
    height: 140px;
  }

  ${media.mobile} {
    width: 120px;
    height: 120px;
  }

  &:hover {
    ${ProfileImage} {
      transform: translate(-50%, -50%) scale(1.4);
      filter: brightness(0.5);
      top: 50%;
    }
    ${InfoOverlay} {
      opacity: 1;
    }
    ${NameBadge} {
      opacity: 0;
    }
  }
`;

// 오버레이 내부 텍스트 스타일
export const Role = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ff5414;
  margin: 0 0 8px;
`;

export const Name = styled.p`
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 12px;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;

  ${media.tablet} {
    display: none;
  }
`;

export const Contact = styled.p`
  font-size: 0.9rem;
  margin-top: 12px;
  opacity: 0.8;
`;
