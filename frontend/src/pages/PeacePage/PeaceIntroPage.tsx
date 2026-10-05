import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_VIEW, USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import PeaceLayout, {
  PEACE_PAGE_TITLE,
} from './components/PeaceLayout/PeaceLayout';
import { CARD_IMAGES } from './components/ResultCard/cardImages';
import { SYMBOL_IMAGES } from './components/ResultCard/symbolImages';
import { PEACE_FESTIVAL } from './constants/festival';
import { PEACE_GREEN } from './constants/peaceColors';
import { usePeaceParams } from './hooks/usePeaceParams';
import * as Styled from './PeaceIntroPage.styles';

const PeaceIntroPage = () => {
  useTrackPageView(PAGE_VIEW.PEACE_INTRO_PAGE);
  // 결과 화면이 네트워크 없이도 뜨도록 카드 이미지를 미리 받아 둔다.
  useEffect(() => {
    Object.values(CARD_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const { src, withParams } = usePeaceParams();

  const handleStart = () => {
    trackEvent(USER_EVENT.QUIZ_STARTED, { festival: PEACE_FESTIVAL, src });
    navigate(withParams('/peace/quiz'));
  };

  return (
    <PeaceLayout tint={PEACE_GREEN.soft}>
      <Styled.Hero>
        <Styled.Dove src={SYMBOL_IMAGES.embracer} alt='' aria-hidden />
        <Styled.Eyebrow>연결이 곧 평화</Styled.Eyebrow>
        <Styled.Title>{PEACE_PAGE_TITLE}</Styled.Title>
        <Styled.Description>
          {
            '8개 질문에 답하면\n나에게 맞는 평화 유형과 활동을 알려드려요.\n30초면 충분해요.'
          }
        </Styled.Description>
      </Styled.Hero>
      <Styled.StartArea>
        <Styled.StartButton type='button' onClick={handleStart}>
          시작하기
        </Styled.StartButton>
      </Styled.StartArea>
    </PeaceLayout>
  );
};

export default PeaceIntroPage;
