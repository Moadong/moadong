import { useNavigate } from 'react-router-dom';
import * as Styled from './IntroSection.styles';
import {
  stagger,
  fadeIn,
  fade,
  fadeUp,
  VIEWPORT_CONFIG,
} from '@/pages/IntroducePage/constants/animations';
import { floatingClubs } from '@/pages/IntroducePage/constants/mockData';
import {
  BackgroundTwistLeft,
  BackgroundTwistRight,
  BackgroundCircleSmall,
  BackgroundCircleLarge,
} from '@/pages/IntroducePage/components/BackgroundShapes';
import search_button_icon from '@/assets/images/icons/search_button_icon.svg';
import introduce_phone_mockup from '@/assets/images/introduce/introduce_phone_mockup.png';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';

const cardPositions = [
  { top: '280px', left: '-300px' },
  { top: '330px', left: '-630px' },
  { top: '280px', right: '-220px' },
  { top: '310px', right: '-580px' },
];

const SHAPES = [
  {
    id: 'twistLeft',
    component: BackgroundTwistLeft,
    top: '-40px',
    left: '20px',
    laptop: { top: '-30px', left: '-20px' },
    tablet: { top: '-20px', left: '-50px' },
    mobile: { top: '-15px', left: '-100px' },
  },
  {
    id: 'twistRight',
    component: BackgroundTwistRight,
    top: '163px',
    right: '-10px',
    laptop: { top: '180px', right: '-0px' },
    tablet: { top: '200px', right: '-50px' },
    mobile: { top: '250px', right: '-80px' },
  },
  {
    id: 'circleSmall',
    component: BackgroundCircleSmall,
    top: '575px',
    left: '411px',
    laptop: { top: '550px', left: '320px' },
    tablet: { top: '500px', left: '110px' },
    mobile: { top: '380px', left: '20px' },
  },
  {
    id: 'circleLarge',
    component: BackgroundCircleLarge,
    top: '380px',
    right: '477px',
    laptop: { top: '300px', right: '350px' },
    tablet: { top: '120px', right: '50px' },
    mobile: { top: '180px', right: '-10px' },
  },
];

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
      {SHAPES.map(({ id, component: Shape, ...pos }) => (
        <Styled.Shape key={id} {...pos}>
          <Shape />
        </Styled.Shape>
      ))}

      <Styled.Container>
        <Styled.TextWrapper>
          <Styled.IntroTitle variants={fadeIn} id='intro-title'>
            모아동아리
          </Styled.IntroTitle>
          <Styled.IntroSubtitle variants={fadeIn}>
            부경대학교의 모든 동아리를 한눈에
          </Styled.IntroSubtitle>
          <Styled.IntroButton variants={fadeIn} onClick={() => navigate('/')}>
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
            {floatingClubs.map((club, index) => (
              <Styled.CardImage
                key={club.id}
                variants={fadeUp}
                {...cardPositions[index]}
              >
                <ClubCard club={club} />
              </Styled.CardImage>
            ))}
          </Styled.PhoneImageWrapper>
        </Styled.VisualWrapper>
      </Styled.Container>
    </Styled.IntroSection>
  );
};

export default IntroSection;
