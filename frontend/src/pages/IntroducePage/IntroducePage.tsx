import * as Styled from './IntroducePage.styles';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import type { Variants, Transition } from 'framer-motion';
import search_button_icon from '@/assets/images/icons/search_button_icon.svg';
import { useNavigate } from 'react-router-dom';
import {
  BackgroundTwistLeft,
  BackgroundTwistRight,
  BackgroundCircleSmall,
  BackgroundCircleLarge,
} from './components/BackgroundShapes';
import introduce_phone_mockup from '@/assets/images/introduce/introduce_phone_mockup.png';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import moadong_logo_bg from '@/assets/images/logos/moadong_logo_bg.svg';
import type { Club } from '@/types/club';
import ClubTag from '@/components/ClubTag/ClubTag';
import useDevice from '@/hooks/useDevice';
import {
  desktopFeatures,
  mobileFeatures,
} from '@/assets/images/introduce/features';
const transDefault: Transition = { duration: 0.5, ease: 'easeOut' };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: transDefault },
};
const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transDefault },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const scrollVariants: Variants = {
  // 1. 'animate' 대신 'scrolling'이라는 상태 이름 사용
  scrolling: (direction: 'left' | 'right') => ({
    x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
    // 2. transition 구조 단순화
    transition: {
      ease: 'linear',
      duration: 40,
      repeat: Infinity,
      repeatType: 'loop',
    },
  }),
};
// 동아리 목업 데이터
const floatingClubs: Club[] = [
  {
    id: 'wap',
    name: 'WAP',
    logo: '',
    tags: ['프로젝트', '소프트웨어'],
    recruitmentStatus: '모집중',
    division: '중앙동아리',
    category: '학술',
    introduction: '개발자들이 모여있습니다.',
  },
  {
    id: 'moadong',
    name: '모아동',
    logo: '',
    tags: ['취미교양', '동아리'],
    recruitmentStatus: '모집중',
    division: '중앙동아리',
    category: '모임',
    introduction: '모여서 만드는 동아리',
  },
  {
    id: 'moaboza',
    name: '모아보자',
    logo: '',
    tags: ['학술', '프로젝트'],
    recruitmentStatus: '모집마감',
    division: '단과대',
    category: '소프트웨어',
    introduction: '데이터로 모아보는 동아리',
  },
  {
    id: 'dddddd',
    name: '모아보즈아앙',
    logo: '',
    tags: ['학술', '프로젝트'],
    recruitmentStatus: '모집마감',
    division: '단과대',
    category: '소프트웨어',
    introduction: '데이터로 모아보는 동아리',
  },
];

const cardPositions = [
  { top: '10%', left: '15%' }, // 1번 카드: 좌측 상단
  { top: '25%', right: '10%' }, // 2번 카드: 우측 상단
  { top: '55%', left: '5%' }, // 3번 카드: 좌측 하단
  { top: '70%', right: '18%' }, // 4번 카드: 우측 하단
];

const tagsRow1 = [
  { type: '운동', label: '운동' },
  { type: '취미교양', label: '취미교양' },
  { type: '공연', label: '공연' },
  { type: '자유', label: '자유' },
  { type: '봉사', label: '봉사' },
  { type: '학술', label: '학술' },
  { type: '종교', label: '종교' },
];
const tagsRow2 = [
  { type: '자유', label: '친목' },
  { type: '자유', label: '스터디' },
  { type: '자유', label: '공모전' },
  { type: '자유', label: '봉사' },
  { type: '자유', label: '음악' },
  { type: '자유', label: '여행' },
  { type: '자유', label: '창업' },
  { type: '자유', label: '자격증' },
  { type: '자유', label: '언어' },
];

const IntroducePage = () => {
  const navigate = useNavigate();
  const { isDesktop } = useDevice();
  const features = isDesktop ? desktopFeatures : mobileFeatures;
  return (
    <>
      <Styled.IntroducePageHeader>
        <Header />
      </Styled.IntroducePageHeader>
      <Styled.Main>
        <Styled.IntroSection
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
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

        <Styled.ProblemSection
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* 제목도 함께 애니메이션되도록 variants를 추가하면 더 자연스럽습니다. */}
          <Styled.ProblemSectionTitle variants={fadeUp}>
            동아리 찾기 너무 불편하지 않으셨나요
          </Styled.ProblemSectionTitle>

          <Styled.BubblesContainer variants={stagger}>
            <Styled.BubbleItem variants={fadeUp} $alignRight={false}>
              <Styled.SpeechBubble>
                원하는 동아리 소개를 보려면 게시물을 끝없이 스크롤해야 했어요.
              </Styled.SpeechBubble>
            </Styled.BubbleItem>
            <Styled.BubbleItem variants={fadeUp} $alignRight={true}>
              <Styled.SpeechBubble>
                모집 게시물이 올라오기 전까지 모집 시기를 알 수 없어 놓친 적도
                많아요
              </Styled.SpeechBubble>
            </Styled.BubbleItem>

            <Styled.BubbleItem variants={fadeUp} $alignRight={false}>
              <Styled.SpeechBubble>
                에브리타임에서 동아리를 찾는 데 너무 많은 시간이 걸려요
              </Styled.SpeechBubble>
            </Styled.BubbleItem>

            <Styled.BubbleItem variants={fadeUp} $alignRight={true}>
              <Styled.SpeechBubble>
                게시물 하나하나 들어가서 확인하려니 너무 번거로웠어요.
              </Styled.SpeechBubble>
            </Styled.BubbleItem>
          </Styled.BubblesContainer>
        </Styled.ProblemSection>

        <Styled.QuestionSection
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
        >
          <Styled.BackgroundQuestionMark variants={fade}>
            ?
          </Styled.BackgroundQuestionMark>
          <Styled.QuestionTitle variants={fadeUp}>
            동아리를 더 쉽고 빠르게 찾을 수 없을까?
          </Styled.QuestionTitle>
        </Styled.QuestionSection>

        <Styled.CatchphraseSection
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.3 }}
        >
          <Styled.BackgroundBrandImage
            src={moadong_logo_bg}
            alt='모아동 로고 배경'
            variants={fade}
          />
          <Styled.CatchphraseWrapper variants={stagger}>
            <Styled.CatchphraseSubtitle variants={fadeUp}>
              이제 동아리 찾느라 시간 낭비하지 마세요
            </Styled.CatchphraseSubtitle>
            <Styled.CatchphraseTitle variants={fadeUp}>
              모든 동아리, 여기 다 모아뒀어요
            </Styled.CatchphraseTitle>
          </Styled.CatchphraseWrapper>
        </Styled.CatchphraseSection>
        <Styled.FeatureSection
          variants={stagger}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
        >
          <Styled.FeatureTitle variants={fadeUp}>
            모아동에서 쉽게 검색해서 동아리 찾기
          </Styled.FeatureTitle>
          <Styled.FeatureSubtitle variants={fadeUp}>
            키워드로 검색해서 간편하게 찾아보세요
          </Styled.FeatureSubtitle>

          <Styled.TagsContainer variants={fade}>
            <Styled.TagRow
              variants={scrollVariants}
              animate='animate'
              custom='left'
            >
              {[...tagsRow1].map((tag, index) => (
                <ClubTag key={index} type={tag.type}>
                  {tag.label}
                </ClubTag>
              ))}
            </Styled.TagRow>
            <Styled.TagRow
              variants={scrollVariants}
              animate='animate'
              custom='right'
            >
              {[...tagsRow2].map((tag, index) => (
                <ClubTag key={index} type={tag.type}>
                  {tag.label}
                </ClubTag>
              ))}
            </Styled.TagRow>
          </Styled.TagsContainer>
        </Styled.FeatureSection>
        <Styled.ConvenienceSection>
          <Styled.ConvenienceTitle>
            더 편리하게 모아동 사용하기
          </Styled.ConvenienceTitle>

          <Styled.FeatureGrid>
            <Styled.Card1 src={features[0].src} alt={features[0].alt} />
            <Styled.Card2 src={features[1].src} alt={features[1].alt} />
            <Styled.Card3 src={features[2].src} alt={features[2].alt} />
            <Styled.Card4 src={features[3].src} alt={features[3].alt} />
          </Styled.FeatureGrid>
        </Styled.ConvenienceSection>

        <Styled.ContactSection>
          <Styled.ContactTitle>
            모아동과 함께하고 싶은 동아리는 연락해주세요!
          </Styled.ContactTitle>
          <Styled.ContactButton>문의하기</Styled.ContactButton>
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
        </Styled.ContactSection>
      </Styled.Main>
      <Styled.IntroducePageFooter>
        <Footer />
      </Styled.IntroducePageFooter>
    </>
  );
};

export default IntroducePage;
