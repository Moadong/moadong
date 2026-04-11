import DefaultMoadongLogo from '@/assets/images/logos/default_profile_image.svg';
import { useGetClubDetail } from '@/hooks/Queries/useClub';
import { useAdminClubId } from '@/store/useAdminClubStore';
import * as Styled from '../Header.styles';

const AdminProfile = () => {
  const { clubId } = useAdminClubId();
  const { data: clubDetail } = useGetClubDetail(clubId || '');
  const { name, logo } = clubDetail || {};

  return (
    <Styled.AdminProfileContainer>
      <Styled.AdminProfileText>
        {name || '관리자'}님 환영합니다!
      </Styled.AdminProfileText>
      <Styled.AdminProfileImage
        src={logo || DefaultMoadongLogo}
        alt='관리자 프로필 이미지'
      />
    </Styled.AdminProfileContainer>
  );
};

export default AdminProfile;
