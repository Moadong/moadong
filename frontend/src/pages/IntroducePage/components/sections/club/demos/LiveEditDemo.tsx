// 관리자 화면에서 한 줄 소개를 고쳐 쓰고 저장을 누르면, 아래 학생이 보는 동아리 페이지(실제 카드)가 그 자리에서 바뀌는 데모
import { useEffect, useRef, useState } from 'react';
import ClubProfileCard from '@/pages/ClubDetailPage/components/ClubProfileCard/ClubProfileCard';
import MacCursor from '@/pages/IntroducePage/components/MacCursor/MacCursor';
import { MOCK_CLUB_PROFILE } from '@/pages/IntroducePage/constants/showcaseMocks';
import useScriptedCursor, {
  CursorStep,
  findByText,
} from '@/pages/IntroducePage/hooks/useScriptedCursor';
import * as Styled from './LiveEditDemo.styles';

const BEFORE_INTRO = MOCK_CLUB_PROFILE.introDescription;
const AFTER_INTRO =
  '매주 목요일 합주, 학기마다 정기공연을 여는 밴드 동아리예요. 악기가 없어도 동방 악기로 시작할 수 있어요 🎸';
const TYPE_MS = 40;

const LiveEditDemo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [saved, setSaved] = useState(false);

  // 입력칸을 누르면 기존 문장을 지우고 새 문장을 한 글자씩 친다
  useEffect(() => {
    if (!typing || typedLength >= AFTER_INTRO.length) return;
    const timer = window.setTimeout(
      () => setTypedLength((prev) => prev + 1),
      TYPE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [typing, typedLength]);

  const steps: CursorStep[] = [
    {
      target: (root) => root.querySelector('[data-demo="intro-input"]'),
      click: true,
      action: () => setTyping(true),
      wait: AFTER_INTRO.length * TYPE_MS + 500,
    },
    {
      target: (root) => findByText(root, 'button', '저장'),
      click: true,
      action: () => setSaved(true),
      hide: true,
      wait: 3000,
    },
  ];

  const reset = () => {
    setTyping(false);
    setTypedLength(0);
    setSaved(false);
  };

  const { cursor, enabled } = useScriptedCursor(rootRef, steps, reset, {
    startAtFirstTarget: true,
  });
  const draft = typing ? AFTER_INTRO.slice(0, typedLength) : BEFORE_INTRO;

  return (
    <Styled.Root ref={rootRef}>
      <Styled.Fit>
        <Styled.Screen>
          <Styled.ScreenLabel>관리자 페이지</Styled.ScreenLabel>
          <Styled.FieldLabel>한 줄 소개</Styled.FieldLabel>
          <Styled.Input data-demo='intro-input' $focused={typing && !saved}>
            {draft}
            {typing && !saved && <Styled.Caret aria-hidden='true' />}
          </Styled.Input>
          <Styled.SaveRow>
            <Styled.SaveButton type='button'>저장</Styled.SaveButton>
          </Styled.SaveRow>
        </Styled.Screen>

        <Styled.Screen $highlight={saved}>
          <Styled.ScreenLabel>학생이 보는 동아리 페이지</Styled.ScreenLabel>
          <Styled.StudentCard>
            <ClubProfileCard
              {...MOCK_CLUB_PROFILE}
              introDescription={saved ? AFTER_INTRO : BEFORE_INTRO}
            />
          </Styled.StudentCard>
        </Styled.Screen>
      </Styled.Fit>
      {enabled && <MacCursor cursor={cursor} />}
    </Styled.Root>
  );
};

export default LiveEditDemo;
