import * as Styled from './QuestionSection.styles';
import { stagger, fade, fadeUp, VIEWPORT_CONFIG } from '@/pages/IntroducePage/constants/animations';

const QuestionSection = () => {
  return (
    <Styled.QuestionSection
      variants={stagger}
      initial='hidden'
      whileInView='show'
      viewport={VIEWPORT_CONFIG}
    >
      <Styled.BackgroundQuestionMark variants={fade}>
        ?
      </Styled.BackgroundQuestionMark>
      <Styled.QuestionTitle variants={fadeUp}>
        동아리를 더 쉽고 빠르게 찾을 수 없을까?
      </Styled.QuestionTitle>
    </Styled.QuestionSection>
  );
};

export default QuestionSection;