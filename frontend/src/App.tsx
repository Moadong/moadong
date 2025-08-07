import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from '@/context/SearchContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { AdminClubProvider } from '@/context/AdminClubContext';
import GlobalStyles from '@/styles/Global.styles';
import MainPage from '@/pages/MainPage/MainPage';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import AdminPage from '@/pages/AdminPage/AdminPage';
import IntroducePage from '@/pages/IntroducePage/IntroducePage';
import ClubInfoEditTab from '@/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTab';
import RecruitEditTab from '@/pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab';
import AccountEditTab from '@/pages/AdminPage/tabs/AccountEditTab/AccountEditTab';
import ApplicationEditTab from './pages/AdminPage/tabs/ApplicationEditTab/ApplicationEditTab';
import LoginTab from '@/pages/AdminPage/auth/LoginTab/LoginTab';
import PrivateRoute from '@/pages/AdminPage/auth/PrivateRoute/PrivateRoute';
import PhotoEditTab from '@/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTab';
import ApplicationFormPage from './pages/ApplicationFormPage/ApplicationFormPage';
import ApplicantsTab from './pages/AdminPage/tabs/ApplicantsTab/ApplicantsTab';
import ApplicantDetailPage from './pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <CategoryProvider>
          <BrowserRouter>
            <GlobalStyles />
            <Routes>
              <Route
                path='/'
                element={
                  <Suspense fallback={null}>
                    <MainPage />
                  </Suspense>
                }
              />
              <Route
                path='/club/:clubId'
                element={
                  <Suspense fallback={null}>
                    <ClubDetailPage />
                  </Suspense>
                }
              />
              <Route path='/introduce' element={<IntroducePage />} />
              <Route path='/admin/login' element={<LoginTab />} />
              <Route
                path='/admin/*'
                element={
                  <AdminClubProvider>
                    <PrivateRoute>
                      <Routes>
                        <Route path='' element={<AdminPage />}>
                          <Route
                            index
                            element={<Navigate to='club-info' replace />}
                          />
                          <Route
                            path='club-info'
                            element={<ClubInfoEditTab />}
                          />
                          <Route
                            path='recruit-edit'
                            element={<RecruitEditTab />}
                          />
                          <Route path='photo-edit' element={<PhotoEditTab />} />
                          <Route
                            path='account-edit'
                            element={<AccountEditTab />}
                          />
                          {/*🔒 메인 브랜치에서는 접근 차단 (배포용 차단 목적)*/}
                          {/*develop-fe 브랜치에서는 접근 가능하도록 풀고 개발 예정*/}
                          <Route
                            path='application-edit'
                            element={<ApplicationEditTab />}
                          />
                          <Route 
                            path='applicants'
                            element={<ApplicantsTab />}
                          />
                          <Route 
                            path='applicants/:questionId'
                            element={<ApplicantDetailPage />}
                          />
                        </Route>
                      </Routes>
                    </PrivateRoute>
                  </AdminClubProvider>
                }
              />
              {/*🔒 사용자용 지원서 작성 페이지도 메인에서는 비활성화 처리 */}
              {/*🛠 develop-fe에서는 다시 노출 예정*/}
              <Route
                path='/application/:clubId'
                element={<ApplicationFormPage />}
              />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </BrowserRouter>
        </CategoryProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
};

export default App;
