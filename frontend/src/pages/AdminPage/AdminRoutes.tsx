import { Navigate, Route, Routes } from 'react-router-dom';
import useDevice from '@/hooks/useDevice';
import AdminPage from '@/pages/AdminPage/AdminPage';
import AdminTabAdapter from '@/pages/AdminPage/AdminTabAdapter';
import AccountEditTab from '@/pages/AdminPage/tabs/AccountEditTab/AccountEditTab';
import ApplicantDetailPage from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/ApplicantDetailPage';
import ApplicantsListTab from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/ApplicantsListTab';
import ApplicantsTab from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsTab';
import ApplicationEditTab from '@/pages/AdminPage/tabs/ApplicationEditTab/ApplicationEditTab';
import ApplicationListTab from '@/pages/AdminPage/tabs/ApplicationListTab/ApplicationListTab';
import CalendarSyncTab from '@/pages/AdminPage/tabs/CalendarSyncTab/CalendarSyncTab';
import ClubInfoEditTab from '@/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTab';
import ClubInfoEditTabMobile from '@/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTabMobile';
import ClubIntroEditTab from '@/pages/AdminPage/tabs/ClubIntroEditTab/ClubIntroEditTab';
import ClubIntroEditTabMobile from '@/pages/AdminPage/tabs/ClubIntroEditTab/ClubIntroEditTabMobile';
import PhotoEditTab from '@/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTab';
import PhotoEditTabMobile from '@/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTabMobile';
import RecruitEditTab from '@/pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab';
import SettingsTab from '@/pages/AdminPage/tabs/SettingsTab/SettingsTab';

const AdminIndexRoute = () => {
  const { isMobile, isTablet } = useDevice();
  if (isMobile || isTablet) return <SettingsTab />;
  return <Navigate to='club-info' replace />;
};

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path='' element={<AdminPage />}>
        <Route index element={<AdminIndexRoute />} />

        {/* 동아리 프로필 */}
        <Route
          path='club-info'
          element={
            <AdminTabAdapter
              desktop={<ClubInfoEditTab />}
              mobile={<ClubInfoEditTabMobile />}
            />
          }
        />
        <Route
          path='club-intro'
          element={
            <AdminTabAdapter
              desktop={<ClubIntroEditTab />}
              mobile={<ClubIntroEditTabMobile />}
            />
          }
        />
        <Route
          path='photo-edit'
          element={
            <AdminTabAdapter
              desktop={<PhotoEditTab />}
              mobile={<PhotoEditTabMobile />}
            />
          }
        />

        {/* 동아리 활동 */}
        <Route path='calendar-sync' element={<CalendarSyncTab />} />
        <Route path='recruit-edit' element={<RecruitEditTab />} />

        {/* 지원 관리 */}
        <Route path='application-list' element={<ApplicationListTab />} />
        <Route
          path='application-list/:applicationFormId/edit'
          element={<ApplicationEditTab />}
        />
        <Route path='application-list/edit' element={<ApplicationEditTab />} />
        <Route path='applicants-list' element={<ApplicantsListTab />} />
        <Route
          path='applicants-list/:applicationFormId'
          element={<ApplicantsTab />}
        />
        <Route
          path='applicants-list/:applicationFormId/:questionId'
          element={<ApplicantDetailPage />}
        />

        {/* 계정 관리 */}
        <Route path='account-edit' element={<AccountEditTab />} />
      </Route>
    </Routes>
  );
}
