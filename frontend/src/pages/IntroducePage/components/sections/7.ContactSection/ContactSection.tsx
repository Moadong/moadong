import {
  BackgroundCircleLarge,
  BackgroundCircleSmall,
  BackgroundTwistLeft,
  BackgroundTwistRight,
} from '@/pages/IntroducePage/components/BackgroundShapes';
import * as Styled from './ContactSection.styles';

const kakaoLink = 'https://open.kakao.com/o/s21dRWjh';

const ContactSection = () => {
  return (
    <Styled.ContactSection>
      <Styled.ContactTitle>
        모아동과 함께하고 싶은 동아리는 연락해주세요!
      </Styled.ContactTitle>
      <Styled.ContactButton
        href={kakaoLink}
        target='_blank'
        rel='noopener noreferrer'
      >
        문의하기
      </Styled.ContactButton>
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
  );
};

export default ContactSection;
