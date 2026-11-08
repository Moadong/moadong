// 커서가 지원자 두 명을 고르고 상태변경에서 합격을 누르면 목록과 현황 숫자가 함께 바뀌는 지원자 관리 데모
import { useRef, useState } from 'react';
import ApplicantListRow from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/ApplicantListRow/ApplicantListRow';
import BulkActionBar from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/BulkActionBar/BulkActionBar';
import StatusSummaryCard from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusSummaryCard/StatusSummaryCard';
import MacCursor from '@/pages/IntroducePage/components/MacCursor/MacCursor';
import {
  MOCK_APPLICANT_SUMMARY,
  MOCK_APPLICANTS,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import useScriptedCursor, {
  CursorStep,
  findByText,
} from '@/pages/IntroducePage/hooks/useScriptedCursor';
import { ApplicationStatus } from '@/types/applicants';
import * as Styled from './demos.styles';

const noop = () => {};

/** 데모에서 합격 처리할 지원자 (서류검토 1명, 면접예정 1명) */
const PICKED = [MOCK_APPLICANTS[0].id, MOCK_APPLICANTS[1].id];

const rowCheckbox = (index: number) => (root: HTMLElement) =>
  root.querySelector(`[data-demo="row-${index}"]`)?.firstElementChild
    ?.firstElementChild;

const ApplicantsDemo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const steps: CursorStep[] = [
    {
      target: rowCheckbox(0),
      click: true,
      action: () => setChecked([PICKED[0]]),
    },
    {
      target: rowCheckbox(1),
      click: true,
      action: () => setChecked(PICKED),
    },
    {
      target: (root) => findByText(root, 'button', '상태변경'),
      click: true,
      action: () => setMenuOpen(true),
    },
    {
      target: (root) => findByText(root, '[data-demo="bulk"] *', '합격'),
      click: true,
      action: () => {
        setMenuOpen(false);
        setChecked([]);
        setAccepted(true);
      },
      wait: 2200,
    },
  ];

  const reset = () => {
    setChecked([]);
    setMenuOpen(false);
    setAccepted(false);
  };

  const { cursor, enabled } = useScriptedCursor(rootRef, steps, reset);

  const applicants = MOCK_APPLICANTS.map((applicant) =>
    accepted && PICKED.includes(applicant.id)
      ? { ...applicant, status: ApplicationStatus.ACCEPTED }
      : applicant,
  );
  // 서류검토 1명, 면접예정 1명이 합격으로 옮겨 간다
  const summary = accepted
    ? {
        ...MOCK_APPLICANT_SUMMARY,
        reviewRequired: MOCK_APPLICANT_SUMMARY.reviewRequired - 1,
        scheduledInterview: MOCK_APPLICANT_SUMMARY.scheduledInterview - 1,
        accepted: MOCK_APPLICANT_SUMMARY.accepted + 2,
      }
    : MOCK_APPLICANT_SUMMARY;

  return (
    <Styled.DemoRoot ref={rootRef}>
      <Styled.Stack>
        <StatusSummaryCard data={summary} />
        <Styled.Toolbar data-demo='bulk'>
          <BulkActionBar
            enabled={checked.length > 0}
            isStatusMenuOpen={menuOpen}
            onToggleStatusMenu={noop}
            onStatusChange={noop}
            onDelete={noop}
          />
          <Styled.SelectedCount $visible={checked.length > 0}>
            {checked.length}명 선택
          </Styled.SelectedCount>
        </Styled.Toolbar>
        <div>
          {applicants.map((applicant, index) => (
            <div key={applicant.id} data-demo={`row-${index}`}>
              <ApplicantListRow
                applicant={applicant}
                isChecked={checked.includes(applicant.id)}
                onCheck={noop}
                onClick={noop}
              />
            </div>
          ))}
        </div>
      </Styled.Stack>
      {enabled && <MacCursor cursor={cursor} />}
    </Styled.DemoRoot>
  );
};

export default ApplicantsDemo;
