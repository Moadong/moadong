// 실제 지원서 질문 칸에 지원 동기가 한 글자씩 채워지는 지원 데모 (보일 때만 타이핑해 섹션 전체가 다시 그려지지 않게 따로 둔다)
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import QuestionAnswerer from '@/components/application/QuestionAnswerer/QuestionAnswerer';
import QuestionContainer from '@/components/application/QuestionContainer/QuestionContainer';
import {
  APPLY_MOTIVATION_EXAMPLES,
  APPLY_SELECTED_DAYS,
  MOCK_QUESTIONS,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import useTypewriter from '@/pages/IntroducePage/hooks/useTypewriter';
import * as Styled from './ApplyDemo.styles';

const APPLY_TYPE_MS = 70;
const [MOTIVATION_QUESTION, DAYS_QUESTION] = MOCK_QUESTIONS;

const noop = () => {};

const ApplyDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const typedMotivation = useTypewriter(APPLY_MOTIVATION_EXAMPLES, {
    typeMs: APPLY_TYPE_MS,
    active: inView,
  });

  return (
    <Styled.Stack ref={ref}>
      <QuestionContainer>
        <QuestionAnswerer
          question={MOTIVATION_QUESTION}
          number={1}
          selectedAnswers={[typedMotivation]}
          onChange={noop}
        />
      </QuestionContainer>
      <QuestionContainer>
        <QuestionAnswerer
          question={DAYS_QUESTION}
          number={2}
          selectedAnswers={APPLY_SELECTED_DAYS}
          onChange={noop}
        />
      </QuestionContainer>
    </Styled.Stack>
  );
};

export default ApplyDemo;
