import { useNavigate } from 'react-router-dom';
import * as Styled from './IntroSection.styles';
import { stagger, fadeIn, fade, fadeUp, VIEWPORT_CONFIG } from '@/pages/IntroducePage/constants/animations';
import { floatingClubs, cardPositions } from '@/pages/IntroducePage/constants/mockData';
import {
  BackgroundTwistLeft,
  BackgroundTwistRight,
  BackgroundCircleSmall,
  BackgroundCircleLarge,
} from '@/pages/IntroducePage/components/BackgroundShapes';
import search_button_icon from '@/assets/images/icons/search_button_icon.svg';
import introduce_phone_mockup from '@/assets/images/introduce/introduce_phone_mockup.png';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';

const IntroSection = () => {
  const navigate = useNavigate();

  return (
    <Styled.IntroSection
      variants={stagger}
      initial='hidden'
      whileInView='show'
      viewport={VIEWPORT_CONFIG}
      aria-labelledby='intro-title'
    >
      {/* 배경 도형 */}
      <Styled.Shape top='-40px' left='20px'>
        <BackgroundTwistLeft />
      </Styled.Shape>
      <Styled.Shape top='163px' right='-10px'>
        <BackgroundTwistRight />
      </Styled.Shape>
      <Styled.Shape top='575px' left='411px'>
        <BackgroundCircleSmall />
      </Styled.Shape>
      <Styled.Shape top='380px' right='477px'>
        <BackgroundCircleLarge />
      </Styled.Shape>

      <Styled.Container>
        <Styled.TextWrapper>
          <Styled.IntroTitle variants={fadeIn} id='intro-title'>
            모아동아리
          </Styled.IntroTitle>
          <Styled.IntroSubtitle variants={fadeIn}>
            부경대학교의 모든 동아리를 한눈에
          </Styled.IntroSubtitle>
          <Styled.IntroButton
            variants={fadeIn}
            onClick={() => navigate('/')}
          >
            동아리 모아보기
            <img
              src={search_button_icon}
              alt='검색 버튼 아이콘'
              className='icon'
            />
          </Styled.IntroButton>
        </Styled.TextWrapper>

        <Styled.VisualWrapper>
          <Styled.PhoneImageWrapper variants={fade}>
            <Styled.PhoneImage
              src={introduce_phone_mockup}
              alt='모아동아리 앱 화면 목업'
            />
          </Styled.PhoneImageWrapper>

          {floatingClubs.map((club, index) => (
            <Styled.CardImage
              key={club.id}
              variants={fadeUp}
              {...cardPositions[index]}
            >
              <ClubCard club={club} />
            </Styled.CardImage>
          ))}
        </Styled.VisualWrapper>
      </Styled.Container>
    </Styled.IntroSection>
  );
};

export default IntroSection;