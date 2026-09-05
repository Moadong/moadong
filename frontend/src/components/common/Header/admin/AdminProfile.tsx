import { useState } from 'react';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useAdminClubId } from '@/store/useAdminClubStore';
import * as Styled from '../Header.styles';

const AdminProfile = () => {
  const { clubId } = useAdminClubId();
  const { data: clubDetail } = useGetClubDetail(clubId || '');
  const { name, logo } = clubDetail || {};
  // 로고 URL이 깨져 alt 문구가 세로로 흘러내리는 걸 막는다. 로고가 바뀌면 다시 시도한다.
  const [brokenLogo, setBrokenLogo] = useState<string | null>(null);
  const showLogo = Boolean(logo) && logo !== brokenLogo;

  return (
    <Styled.AdminProfileContainer>
      <Styled.AdminProfileText>
        {name || '관리자'}님 환영합니다!
      </Styled.AdminProfileText>
      {showLogo ? (
        <Styled.AdminProfileImage
          src={logo}
          alt='관리자 프로필 이미지'
          onError={() => setBrokenLogo(logo ?? null)}
        />
      ) : (
        <Styled.AdminProfilePlaceholder aria-hidden />
      )}
    </Styled.AdminProfileContainer>
  );
};

export default AdminProfile;
