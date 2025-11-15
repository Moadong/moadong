import * as Styled from '../Header.styles';
import DefaultMoadongLogo from '@/assets/images/logos/default_profile_image.svg';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { useGetClubDetail } from '@/hooks/queries/club/useGetClubDetail';

const AdminProfile = () => {
  const { clubId } = useAdminClubContext();
  const { data: clubDetail } = useGetClubDetail(clubId || '');

  return (
    <Styled.AdminProfileContainer>
      <Styled.AdminProfileText>
        {clubDetail?.name}님 환영합니다!
      </Styled.AdminProfileText>
      <Styled.AdminProfileImage
        src={clubDetail?.logo || DefaultMoadongLogo}
        alt='관리자 프로필 이미지'
      />
    </Styled.AdminProfileContainer>
  );
};

export default AdminProfile;
