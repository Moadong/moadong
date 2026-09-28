import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PeaceLayout from './components/PeaceLayout/PeaceLayout';
import { KIOSK_IDLE_MS } from './constants/kiosk';
import { PEACE_QUESTIONS } from './data/questions';
import { useIdleReset } from './hooks/useIdleReset';
import { usePeaceParams } from './hooks/usePeaceParams';
import * as Styled from './PeaceQuizPage.styles';
import { rankPeaceTypes } from './utils/calculatePeaceType';

const TOTAL = PEACE_QUESTIONS.length;

const PeaceQuizPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_QUIZ_PAGE);
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { isKiosk, src, withParams } = usePeaceParams();
  // answers.length가 곧 현재 문항 인덱스다. 별도 인덱스 상태를 두지 않는다.
  const [answers, setAnswers] = useState<number[]>([]);

  // 부스에서 중간에 떠난 방문객의 답이 다음 사람에게 넘어가지 않게 한다
  useIdleReset(isKiosk, KIOSK_IDLE_MS, () =>
    navigate(withParams('/peace'), { replace: true }),
  );

  const questionIndex = answers.length;
  const question = PEACE_QUESTIONS[questionIndex];

  // 렌더 시점 answers로 next를 만든다. 리렌더 전 중복 탭은 같은 배열을 두 번 set할 뿐이라
  // 한 문항만 진행된다. 함수형 업데이터(prev => [...prev, i])를 쓰면 두 번 진행되므로 쓰지 않는다.
  const handleSelect = (optionIndex: number) => {
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (next.length === TOTAL) {
      const [type, sub] = rankPeaceTypes(next);
      trackEvent(USER_EVENT.PEACE_QUIZ_COMPLETED, { type, sub, src });
      navigate(withParams(`/peace/result?type=${type}&sub=${sub}`), {
        replace: true,
      });
    }
  };

  const handleBack = () => {
    if (answers.length === 0) {
      navigate(withParams('/peace'));
      return;
    }
    setAnswers((prev) => prev.slice(0, -1));
  };

  if (!question) return null;

  return (
    <PeaceLayout kiosk={isKiosk}>
      <Styled.TopRow>
        <Styled.BackButton type='button' onClick={handleBack}>
          이전
        </Styled.BackButton>
        <Styled.Progress>{`${questionIndex + 1} / ${TOTAL}`}</Styled.Progress>
      </Styled.TopRow>
      <Styled.ProgressBar $ratio={questionIndex / TOTAL} />
      <Styled.Question>{question.text}</Styled.Question>
      <Styled.OptionList>
        {question.options.map((option, i) => (
          <Styled.OptionButton
            key={option.label}
            type='button'
            onClick={() => handleSelect(i)}
          >
            {option.label}
          </Styled.OptionButton>
        ))}
      </Styled.OptionList>
    </PeaceLayout>
  );
};

export default PeaceQuizPage;
