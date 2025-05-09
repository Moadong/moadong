import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from '@/context/SearchContext';
import { AdminClubProvider } from '@/context/AdminClubContext';
import GlobalStyles from '@/styles/Global.styles';
import MainPage from '@/pages/MainPage/MainPage';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import AdminPage from '@/pages/AdminPage/AdminPage';
import IntroducePage from '@/pages/IntroducePage/IntroducePage';
import ClubInfoEditTab from '@/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTab';
import RecruitEditTab from '@/pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab';
import AccountEditTab from '@/pages/AdminPage/tabs/AccountEditTab/AccountEditTab';
import LoginTab from '@/pages/AdminPage/auth/LoginTab/LoginTab';
import PrivateRoute from '@/pages/AdminPage/auth/PrivateRoute/PrivateRoute';
import PhotoEditTab from '@/pages/AdminPage/tabs/PhotoEditTab/PhotoEditTab';

const queryClient = new QueryClient();

// [x]TODO: fallback component 추가

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
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
                        <Route path='club-info' element={<ClubInfoEditTab />} />
                        <Route
                          path='recruit-edit'
                          element={<RecruitEditTab />}
                        />
                        <Route path='photo-edit' element={<PhotoEditTab />} />
                        <Route
                          path='account-edit'
                          element={<AccountEditTab />}
                        />
                      </Route>
                    </Routes>
                  </PrivateRoute>
                </AdminClubProvider>
              }
            />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </QueryClientProvider>
  );
};

export default App;
