import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

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
  margin: 0 auto 60px;

  ${media.mobile} {
    font-size: 1rem;
    margin-bottom: 40px;
  }
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 40px 30px;

  ${media.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 30px 20px;
  }

  ${media.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 15px;
  }
`;

export const InfoOverlay = styled.div`
  position: absolute;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
`;

export const NameBadge = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  padding: 5px 15px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 1rem;
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

export const ProfileCardContainer = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    ${ProfileImage} {
      transform: scale(1.1);
      filter: brightness(0.5);
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
`;

export const Contact = styled.p`
  font-size: 0.9rem;
  margin-top: 12px;
  opacity: 0.8;
`;
