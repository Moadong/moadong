import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PeaceLayout from './components/PeaceLayout/PeaceLayout';
import { SYMBOL_IMAGES } from './components/ResultCard/symbolImages';
import { ANALYZING_MS, KIOSK_IDLE_MS } from './constants/kiosk';
import { PEACE_QUESTIONS } from './data/questions';
import { useIdleReset } from './hooks/useIdleReset';
import { usePeaceParams } from './hooks/usePeaceParams';
import * as Styled from './PeaceQuizPage.styles';
import { rankPeaceTypes } from './utils/calculatePeaceType';

const TOTAL = PEACE_QUESTIONS.length;
/** 답 직후 이 시간 안의 탭은 무시한다. 더블탭이 다음 문항의 답으로 잡히지 않게 */
const TAP_GUARD_MS = 300;

const PeaceQuizPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_QUIZ_PAGE);
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { isKiosk, src, withParams } = usePeaceParams();
  // answers.length가 곧 현재 문항 인덱스다. 별도 인덱스 상태를 두지 않는다.
  const [answers, setAnswers] = useState<number[]>([]);
  // 답 직후 잠깐 잠근다. 시각 비교 대신 타이머로 풀어 렌더 순수성 규칙을 피한다
  const isLockedRef = useRef(false);

  // 부스에서 중간에 떠난 방문객의 답이 다음 사람에게 넘어가지 않게 한다
  useIdleReset(isKiosk, KIOSK_IDLE_MS, () =>
    navigate(withParams('/peace'), { replace: true }),
  );

  const questionIndex = answers.length;
  const question = PEACE_QUESTIONS[questionIndex];

  // 렌더 시점 answers로 next를 만든다. 리렌더 전 중복 탭은 같은 배열을 두 번 set할 뿐이라
  // 한 문항만 진행된다. 함수형 업데이터(prev => [...prev, i])를 쓰면 두 번 진행되므로 쓰지 않는다.
  // 리렌더 뒤에 들어온 두 번째 탭은 다음 문항 버튼을 누르게 되므로 시간 가드로 막는다.
  const handleSelect = (optionIndex: number) => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    window.setTimeout(() => {
      isLockedRef.current = false;
    }, TAP_GUARD_MS);
    const next = [...answers, optionIndex];
    setAnswers(next);
    if (next.length === TOTAL) {
      const [type, sub] = rankPeaceTypes(next);
      trackEvent(USER_EVENT.PEACE_QUIZ_COMPLETED, { type, sub, src });
      // "분석 중"을 잠깐 보여준 뒤 결과로 간다. 유형은 이미 정해져 있다
      window.setTimeout(() => {
        navigate(withParams(`/peace/result?type=${type}&sub=${sub}`), {
          replace: true,
        });
      }, ANALYZING_MS);
    }
  };

  const handleBack = () => {
    if (answers.length === 0) {
      navigate(withParams('/peace'));
      return;
    }
    setAnswers((prev) => prev.slice(0, -1));
  };

  if (!question) {
    const [type] = rankPeaceTypes(answers);
    return (
      <PeaceLayout>
        <Styled.Analyzing role='status'>
          <Styled.AnalyzingSymbol
            src={SYMBOL_IMAGES[type]}
            alt=''
            animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Styled.AnalyzingText>
            당신의 평화 유형을
            <br />
            분석하고 있어요…
          </Styled.AnalyzingText>
        </Styled.Analyzing>
      </PeaceLayout>
    );
  }

  return (
    <PeaceLayout>
      <Styled.TopRow>
        <Styled.BackButton type='button' onClick={handleBack}>
          이전
        </Styled.BackButton>
        <Styled.Progress>{`${questionIndex + 1} / ${TOTAL}`}</Styled.Progress>
      </Styled.TopRow>
      <Styled.ProgressBar $ratio={questionIndex / TOTAL} />
      <Styled.Question>
        <Styled.QuestionLabel>{`Q${questionIndex + 1}.`}</Styled.QuestionLabel>
        {question?.text}
      </Styled.Question>
      <Styled.OptionList>
        {question?.options.map((option, i) => (
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
