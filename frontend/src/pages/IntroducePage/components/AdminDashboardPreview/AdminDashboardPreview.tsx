// 운영진 첫 화면용: 맥 브라우저 창 안 실제 관리자 화면(사이드바·지원자 현황)에 새 지원서가 실시간으로 들어오는 장면
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import moadong_logo from '@/assets/images/logos/moadong_mobile_logo.svg';
import { ADMIN_TABS } from '@/constants/adminTabs';
import ApplicantListRow from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/ApplicantListRow/ApplicantListRow';
import StatusSummaryCard from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusSummaryCard/StatusSummaryCard';
import {
  ARRIVING_APPLICANTS,
  MOCK_APPLICANT_SUMMARY,
  MOCK_APPLICANTS,
} from '@/pages/IntroducePage/constants/showcaseMocks';
import { ApplicationStatus } from '@/types/applicants';
import type { Applicant } from '@/types/applicants';
import { asApplicantId, asApplicationFormId } from '@/types/branded';
import * as Styled from './AdminDashboardPreview.styles';

/** 미리보기에서 지금 보고 있는 관리자 메뉴 */
const ACTIVE_PATH = '/admin/applicants-list';

const ARRIVE_MS = 1700;
const VISIBLE_ROWS = 5;

const noop = () => {};

const newApplicant = (index: number): Applicant => {
  const { name, memo } =
    ARRIVING_APPLICANTS[index % ARRIVING_APPLICANTS.length];
  return {
    id: asApplicantId(`arrived-${index}`),
    status: ApplicationStatus.SUBMITTED,
    answers: [{ id: 1, value: name }],
    memo,
    createdAt: new Date().toISOString(),
    applicationFormId: asApplicationFormId('form-intro'),
  };
};

/** 보이는 동안 일정 간격으로 새 지원자를 맨 위에 하나씩 넣는다 */
const useArrivingApplicants = (inView: boolean) => {
  const reduceMotion = useReducedMotion();
  const [arrived, setArrived] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timer = window.setInterval(
      () => setArrived((prev) => prev + 1),
      ARRIVE_MS,
    );
    return () => window.clearInterval(timer);
  }, [inView, reduceMotion]);

  return arrived;
};

const AdminDashboardPreview = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const arrived = useArrivingApplicants(inView);

  const newcomers = Array.from({ length: arrived }, (_, index) =>
    newApplicant(index),
  ).reverse();
  const rows = [...newcomers, ...MOCK_APPLICANTS].slice(0, VISIBLE_ROWS);
  const summary = {
    ...MOCK_APPLICANT_SUMMARY,
    total: MOCK_APPLICANT_SUMMARY.total + arrived,
    reviewRequired: MOCK_APPLICANT_SUMMARY.reviewRequired + arrived,
  };
  const latest = newcomers[0];

  return (
    <Styled.Fade ref={rootRef}>
      <Styled.Window>
        <Styled.TitleBar aria-hidden='true'>
          <Styled.Dots>
            <span />
            <span />
            <span />
          </Styled.Dots>
          <Styled.Address>moadong.com/admin/applicants-list</Styled.Address>
        </Styled.TitleBar>

        {/* 안의 실제 컴포넌트는 누르면 이동·이벤트 전송이 일어나므로 보기 전용으로 막는다 */}
        <Styled.Body aria-hidden='true' inert>
          {/* 실제 관리자 메뉴 구성(ADMIN_TABS)을 쓰되, 미리보기에 맞게 촘촘하고 정돈된 모양으로 그린다 */}
          <Styled.Sidebar>
            <Styled.SidebarBrand>
              <img src={moadong_logo} alt='' />
              모아밴드 관리자
            </Styled.SidebarBrand>
            {ADMIN_TABS.map((tab) => (
              <Styled.SidebarGroup key={tab.category}>
                <Styled.SidebarCategory>{tab.category}</Styled.SidebarCategory>
                {tab.items.map((item) => (
                  <Styled.SidebarItem
                    key={item.path}
                    $active={item.path === ACTIVE_PATH}
                  >
                    {item.label}
                  </Styled.SidebarItem>
                ))}
              </Styled.SidebarGroup>
            ))}
          </Styled.Sidebar>
          <Styled.Main>
            <Styled.PageHeader>
              <Styled.PageTitle>지원자 현황</Styled.PageTitle>
              <Styled.FormName>2026년 2학기 신입 부원 모집</Styled.FormName>
            </Styled.PageHeader>
            <StatusSummaryCard data={summary} />
            <Styled.List>
              <AnimatePresence initial={false}>
                {rows.map((applicant) => (
                  <motion.div
                    key={applicant.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: -16,
                      backgroundColor: 'rgba(255, 84, 20, 0.12)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      backgroundColor: 'rgba(255, 84, 20, 0)',
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      layout: { type: 'spring', stiffness: 380, damping: 32 },
                      backgroundColor: { duration: 1.4, delay: 0.3 },
                      default: { duration: 0.35 },
                    }}
                  >
                    <ApplicantListRow
                      applicant={applicant}
                      isChecked={false}
                      onCheck={noop}
                      onClick={noop}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Styled.List>
          </Styled.Main>

          <AnimatePresence>
            {latest && (
              <Styled.Toast
                key={latest.id}
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Styled.ToastDot />새 지원서가 도착했어요 ·{' '}
                {latest.answers[0].value}
              </Styled.Toast>
            )}
          </AnimatePresence>
        </Styled.Body>
      </Styled.Window>
    </Styled.Fade>
  );
};

export default AdminDashboardPreview;
