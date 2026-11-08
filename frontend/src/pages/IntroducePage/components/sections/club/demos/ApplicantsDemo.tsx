// 지원서 답변을 읽고 상태(면접예정·합격)를 누른 뒤 다음 지원자로 넘어가는 지원서 상세 데모 (실제 모바일 지원서 상세 화면의 부품을 쓴다)
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AVAILABLE_STATUSES } from '@/constants/status';
import * as DetailStyled from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/ApplicantDetailPageMobile.styles';
import AnswerCard from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/components/mobile/AnswerCard/AnswerCard';
import ApplicantNavHeader from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/components/mobile/ApplicantNavHeader/ApplicantNavHeader';
import MacCursor from '@/pages/IntroducePage/components/MacCursor/MacCursor';
import {
  AI_DRAFT_QUESTIONS,
  REVIEW_APPLICANTS,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import useScriptedCursor, {
  CursorStep,
  findByText,
} from '@/pages/IntroducePage/hooks/useScriptedCursor';
import { ApplicationStatus } from '@/types/applicants';
import mapStatusToGroup from '@/utils/mapStatusToGroup';
import * as Styled from './demos.styles';

const noop = () => {};

const NAV_ITEMS = REVIEW_APPLICANTS.map(({ id, name }) => ({ id, name }));
const INITIAL_STATUSES = REVIEW_APPLICANTS.map(
  () => ApplicationStatus.SUBMITTED,
);

const statusTab = (status: ApplicationStatus) => (root: HTMLElement) =>
  findByText(
    root,
    '[data-demo="status"] button',
    mapStatusToGroup(status).label,
  );
const nextButton = (root: HTMLElement) =>
  root.querySelector('[aria-label="다음 지원자"]');

const ApplicantsDemo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);

  const setStatus = (target: number, status: ApplicationStatus) =>
    setStatuses((prev) =>
      prev.map((current, i) => (i === target ? status : current)),
    );

  // 답변을 읽을 시간을 두고 상태를 정한 뒤 다음 지원자로 넘어간다
  const steps: CursorStep[] = [
    {
      target: statusTab(ApplicationStatus.ACCEPTED),
      click: true,
      action: () => setStatus(0, ApplicationStatus.ACCEPTED),
      wait: 450,
    },
    { target: nextButton, click: true, action: () => setIndex(1), wait: 900 },
    {
      target: statusTab(ApplicationStatus.INTERVIEW_SCHEDULED),
      click: true,
      action: () => setStatus(1, ApplicationStatus.INTERVIEW_SCHEDULED),
      wait: 450,
    },
    { target: nextButton, click: true, action: () => setIndex(2), wait: 900 },
    {
      target: statusTab(ApplicationStatus.ACCEPTED),
      click: true,
      action: () => setStatus(2, ApplicationStatus.ACCEPTED),
      hide: true,
      wait: 1800,
    },
  ];

  const reset = () => {
    setIndex(0);
    setStatuses(INITIAL_STATUSES);
  };

  const { cursor, enabled } = useScriptedCursor(rootRef, steps, reset, {
    startAtFirstTarget: true,
  });

  const applicant = REVIEW_APPLICANTS[index];

  return (
    <Styled.DemoRoot ref={rootRef}>
      <DetailStyled.TopSection>
        <ApplicantNavHeader
          applicants={NAV_ITEMS}
          currentIndex={index}
          onPrev={noop}
          onNext={noop}
          onSelect={noop}
        />
        <DetailStyled.StatusTabRow data-demo='status'>
          {AVAILABLE_STATUSES.map((status) => (
            <DetailStyled.StatusTab
              key={status}
              type='button'
              $isSelected={statuses[index] === status}
            >
              {mapStatusToGroup(status).label}
            </DetailStyled.StatusTab>
          ))}
        </DetailStyled.StatusTabRow>
      </DetailStyled.TopSection>

      <DetailStyled.Divider />

      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={applicant.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <DetailStyled.AnswerList>
            {AI_DRAFT_QUESTIONS.map((question, i) => (
              <AnswerCard
                key={question.id}
                index={i + 1}
                question={question}
                answers={applicant.answers[question.id] ?? []}
              />
            ))}
          </DetailStyled.AnswerList>
        </motion.div>
      </AnimatePresence>
      {enabled && <MacCursor cursor={cursor} />}
    </Styled.DemoRoot>
  );
};

export default ApplicantsDemo;
