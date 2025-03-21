import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from '@/context/SearchContext';
import GlobalStyles from '@/styles/Global.styles';
import MainPage from '@/pages/MainPage/MainPage';
import ClubDetailPage from '@/pages/ClubDetailPage/ClubDetailPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ClubInfoEditTab from '@/pages/AdminPage/tabs/ClubInfoEditTab/ClubInfoEditTab';
import RecruitEditTab from './pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab';
import AccountEditTab from './pages/AdminPage/tabs/AccountEditTab/AccountEditTab';
import LoginTab from './pages/AdminPage/tabs/LoginTab/LoginTab';

const queryClient = new QueryClient();

// [x]TODO: fallback component 추가

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <BrowserRouter>
          <GlobalStyles />
          <Suspense fallback={null}>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/club/:clubId' element={<ClubDetailPage />} />
              <Route path='login' element={<LoginTab />} />
              <Route path='/admin' element={<AdminPage />}>
                <Route index element={<Navigate to='club-info' replace />} />
                <Route path='club-info' element={<ClubInfoEditTab />} />
                <Route path='recruit-edit' element={<RecruitEditTab />} />
                <Route path='account-edit' element={<AccountEditTab />} />
              </Route>
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SearchProvider>
    </QueryClientProvider>
  );
};

export default App;
