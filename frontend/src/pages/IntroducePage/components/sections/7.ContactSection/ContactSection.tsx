import * as Styled from './ContactSection.styles';
import {
  BackgroundTwistLeft,
  BackgroundTwistRight,
  BackgroundCircleSmall,
  BackgroundCircleLarge,
} from '@/pages/IntroducePage/components/BackgroundShapes';

const ContactSection = () => {
  return (
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
  );
};

export default ContactSection;