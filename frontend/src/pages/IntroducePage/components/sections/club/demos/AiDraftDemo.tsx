// 커서가 "✨ AI로 초안 생성"을 누르면 잠깐 생성 중을 보여준 뒤 지원서 제목과 질문이 하나씩 채워지는 AI 초안 데모
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '@/components/common/Spinner/Spinner';
import QuestionBuilder from '@/pages/AdminPage/components/QuestionBuilder/QuestionBuilder';
import * as EditStyled from '@/pages/AdminPage/tabs/ApplicationTab/ApplicationEditTab/ApplicationEditTab.styles';
import MacCursor from '@/pages/IntroducePage/components/MacCursor/MacCursor';
import {
  AI_DRAFT_QUESTIONS,
  AI_DRAFT_TITLE,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import useScriptedCursor, {
  CursorStep,
  findByText,
} from '@/pages/IntroducePage/hooks/useScriptedCursor';
import * as Styled from './demos.styles';

const noop = () => {};
const MONTHLY_LIMIT = 3;

type Phase = 'empty' | 'loading' | 'done';

const AiDraftDemo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('empty');
  const [shown, setShown] = useState(0);

  const steps: CursorStep[] = [
    {
      target: (root) => findByText(root, 'button', '✨ AI로 초안 생성'),
      click: true,
      action: () => setPhase('loading'),
      wait: 1400,
    },
    ...AI_DRAFT_QUESTIONS.map((_, index) => ({
      action: () => {
        setPhase('done');
        setShown(index + 1);
      },
      wait: 450,
    })),
    { wait: 2400 },
  ];

  const reset = () => {
    setPhase('empty');
    setShown(0);
  };

  const { cursor, enabled } = useScriptedCursor(rootRef, steps, reset);

  return (
    <Styled.DemoRoot ref={rootRef}>
      <Styled.DesktopCanvas>
        <EditStyled.HeaderContainer>
          <EditStyled.ChangeButtonWrapper>
            <EditStyled.ApplicationFormChangeButton $active>
              모아동지원서
            </EditStyled.ApplicationFormChangeButton>
            <EditStyled.ApplicationFormChangeButton $active={false}>
              외부지원서
            </EditStyled.ApplicationFormChangeButton>
          </EditStyled.ChangeButtonWrapper>
          <EditStyled.AiDraftActions>
            <EditStyled.AiDraftRemaining>
              이번 달 {phase === 'empty' ? MONTHLY_LIMIT : MONTHLY_LIMIT - 1}회
              남음
            </EditStyled.AiDraftRemaining>
            <EditStyled.AiDraftButton type='button'>
              ✨ AI로 초안 생성
            </EditStyled.AiDraftButton>
          </EditStyled.AiDraftActions>
        </EditStyled.HeaderContainer>

        <EditStyled.FormTitle
          readOnly
          value={phase === 'done' ? AI_DRAFT_TITLE : ''}
          placeholder='지원서 제목을 입력하세요'
        />

        <Styled.Questions>
          <AnimatePresence>
            {AI_DRAFT_QUESTIONS.slice(0, shown).map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <QuestionBuilder
                  {...question}
                  readOnly
                  onTitleChange={noop}
                  onDescriptionChange={noop}
                  onRemoveQuestion={noop}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Styled.Questions>

        <AnimatePresence>
          {phase === 'loading' && (
            <Styled.Generating
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Spinner height='auto' />
              <EditStyled.AiLoadingText>
                지원서 자동 생성 중...
              </EditStyled.AiLoadingText>
            </Styled.Generating>
          )}
        </AnimatePresence>
      </Styled.DesktopCanvas>
      {enabled && <MacCursor cursor={cursor} />}
    </Styled.DemoRoot>
  );
};

export default AiDraftDemo;
