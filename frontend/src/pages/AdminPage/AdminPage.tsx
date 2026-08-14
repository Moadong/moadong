import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useGetApplicationList } from '@/hooks/Queries/useApplication';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import PersonalInfoConsentModal from '@/pages/AdminPage/components/PersonalInfoConsentModal/PersonalInfoConsentModal';
import SideBar from '@/pages/AdminPage/components/SideBar/SideBar';
import { useAdminClubId } from '@/store/useAdminClubStore';
import * as Styled from './AdminPage.styles';

const AdminPage = () => {
  const { clubId } = useAdminClubId();
  const [hasConsented, setHasConsented] = useState(
    () =>
      localStorage.getItem(STORAGE_KEYS.HAS_CONSENTED_PERSONAL_INFO) === 'true',
  );
  const { data: clubDetail, error } = useGetClubDetail(clubId || '');
  useGetApplicationList(); // 지원서 목록 프리패치 (모바일 지원자 탭 첫 로딩 단축)

  if (!clubDetail) {
    return null;
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Header hideOn={['mobile', 'tablet']} />
      {!hasConsented && (
        <PersonalInfoConsentModal
          clubName={clubDetail.name}
          onConsent={() => setHasConsented(true)}
        />
      )}
      <Styled.Background>
        <Styled.Layout>
          <SideBar />
          <Styled.MainContent>
            <Outlet context={clubDetail} />
          </Styled.MainContent>
        </Styled.Layout>
      </Styled.Background>
    </>
  );
};

export default AdminPage;
