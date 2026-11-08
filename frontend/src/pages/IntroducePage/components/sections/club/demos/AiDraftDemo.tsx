// "AI로 초안 생성"을 누르면 잠깐 반짝이는 자리 표시 뒤에 실제 지원서 편집 화면에 제목과 질문이 한 번에 채워지는 AI 초안 데모
import { useRef, useState } from 'react';
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
import AiSparkle from './AiSparkle';
import * as Styled from './demos.styles';

const noop = () => {};
type Phase = 'empty' | 'thinking' | 'done';

const AiDraftDemo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('empty');

  const steps: CursorStep[] = [
    {
      target: (root) => findByText(root, 'button', 'AI로 초안 생성'),
      click: true,
      action: () => setPhase('thinking'),
      hide: true,
      wait: 1200,
    },
    { action: () => setPhase('done'), wait: 3600 },
  ];

  const reset = () => setPhase('empty');

  const { cursor, enabled } = useScriptedCursor(rootRef, steps, reset, {
    startAtFirstTarget: true,
  });

  // 생성 전은 실제 편집 화면 대신 버튼 하나만 크게 둔 시작 화면으로 보여 준다
  if (phase === 'empty') {
    return (
      <Styled.DemoRoot ref={rootRef}>
        <Styled.DraftStart>
          <AiSparkle />
          <Styled.DraftStartTitle>
            이번 학기 지원서, AI가 써 드려요
          </Styled.DraftStartTitle>
          {/* 실제 지원서 편집 화면의 버튼을 그대로 쓰고 크기만 키운다 */}
          <Styled.RealButtonScale>
            <EditStyled.AiDraftButton type='button'>
              AI로 초안 생성
            </EditStyled.AiDraftButton>
          </Styled.RealButtonScale>
        </Styled.DraftStart>
        {enabled && <MacCursor cursor={cursor} />}
      </Styled.DemoRoot>
    );
  }

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
            <EditStyled.AiDraftButton type='button'>
              AI로 초안 생성
            </EditStyled.AiDraftButton>
          </EditStyled.AiDraftActions>
        </EditStyled.HeaderContainer>

        {phase === 'done' ? (
          // 제목과 질문이 한꺼번에 흐릿했다 또렷해지고, 빛이 위에서 아래로 한 번 훑고 지나간다
          <Styled.DraftResult
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <EditStyled.FormTitle readOnly value={AI_DRAFT_TITLE} />
            <Styled.Questions>
              {AI_DRAFT_QUESTIONS.map((question) => (
                <QuestionBuilder
                  key={question.id}
                  {...question}
                  readOnly
                  onTitleChange={noop}
                  onDescriptionChange={noop}
                  onRemoveQuestion={noop}
                />
              ))}
            </Styled.Questions>
            <Styled.Sweep
              initial={{ y: '-30%', opacity: 1 }}
              animate={{ y: '130%', opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </Styled.DraftResult>
        ) : (
          // AI가 쓰는 잠깐 동안 자리만 잡힌 질문 칸이 무지갯빛으로 반짝인다
          <Styled.Thinking>
            <Styled.Skeleton $height={56} />
            <Styled.Skeleton $height={150} />
            <Styled.Skeleton $height={150} />
          </Styled.Thinking>
        )}
      </Styled.DesktopCanvas>
      {enabled && <MacCursor cursor={cursor} />}
    </Styled.DemoRoot>
  );
};

export default AiDraftDemo;
