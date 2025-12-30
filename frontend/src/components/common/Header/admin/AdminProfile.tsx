import DefaultMoadongLogo from '@/assets/images/logos/default_profile_image.svg';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';
import * as Styled from '../Header.styles';

const AdminProfile = () => {
  const { clubId } = useAdminClubContext();
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
