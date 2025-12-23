import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPage from '@/pages/AdminPage/AdminPage';
import AccountEditTab from '@/pages/AdminPage/tabs/AccountEditTab/AccountEditTab';
import ApplicantDetailPage from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/ApplicantDetailPage';
import ApplicantsListTab from '@/pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/ApplicantsListTab';
import ApplicationEditTab from '@/pages/AdminPage/tabs/ApplicationEditTab/ApplicationEditTab';
import ApplicationListTab from '@/pages/AdminPage/tabs/ApplicationListTab/ApplicationListTab';
import ClubInfoEditTab from '@/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTab';
import PhotoEditTab from '@/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTab';
import RecruitEditTab from '@/pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab';
import ApplicantsTab from './tabs/ApplicantsTab/ApplicantsTab';
import ClubDetailTab from './tabs/ClubDetailTab/ClubDetailTab';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path='' element={<AdminPage />}>
        <Route index element={<Navigate to='club-info' replace />} />
        <Route path='club-info' element={<ClubInfoEditTab />} />
        <Route path='recruit-edit' element={<RecruitEditTab />} />
        <Route path='photo-edit' element={<PhotoEditTab />} />
        <Route path='account-edit' element={<AccountEditTab />} />
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
        <Route path='club-detail' element={<ClubDetailTab />} />
      </Route>
    </Routes>
  );
}
