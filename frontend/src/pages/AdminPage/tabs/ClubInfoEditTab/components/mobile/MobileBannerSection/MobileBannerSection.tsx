import { useRef } from 'react';
import LogoEditIcon from '@/assets/images/icons/logo_edit_icon.svg?react';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';
import { useDeleteCover, useUploadCover } from '@/hooks/Queries/useClubCover';
import { useUploadLogo } from '@/hooks/Queries/useClubImages';
import { useAdminClubId } from '@/store/useAdminClubStore';
import * as Styled from './MobileBannerSection.styles';

interface MobileBannerSectionProps {
  coverUrl?: string | null;
  logoUrl?: string | null;
  bannerColor: string;
}

const MobileBannerSection = ({
  coverUrl,
  logoUrl,
  bannerColor,
}: MobileBannerSectionProps) => {
  const { clubId } = useAdminClubId();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadCover } = useUploadCover();
  const { mutate: deleteCover } = useDeleteCover();
  const { mutate: uploadLogo } = useUploadLogo();

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !clubId) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요! 10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }
    uploadCover({ clubId, file });
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !clubId) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요! 10MB 이하 이미지만 업로드할 수 있어요.');
      return;
    }
    uploadLogo({ clubId, file });
  };

  const handleDeleteCover = () => {
    if (!clubId) return;
    deleteCover(clubId);
  };

  return (
    <Styled.BannerArea $bgColor={bannerColor}>
      {coverUrl && <Styled.CoverImage src={coverUrl} alt='커버 이미지' />}
      <Styled.BannerButtonGroup>
        <Styled.BannerEditButton onClick={() => coverInputRef.current?.click()}>
          배너 수정
        </Styled.BannerEditButton>
        {coverUrl && (
          <Styled.BannerEditButton onClick={handleDeleteCover}>
            초기화
          </Styled.BannerEditButton>
        )}
      </Styled.BannerButtonGroup>

      <Styled.LogoWrapper>
        <Styled.LogoFrame>
          <Styled.LogoImage
            src={logoUrl || defaultLogo}
            alt='동아리 로고'
            onClick={() => logoInputRef.current?.click()}
          />
        </Styled.LogoFrame>
        <Styled.LogoEditButton
          onClick={() => logoInputRef.current?.click()}
          aria-label='로고 수정'
        >
          <LogoEditIcon />
        </Styled.LogoEditButton>
      </Styled.LogoWrapper>

      <Styled.HiddenInput
        ref={coverInputRef}
        type='file'
        accept='image/*'
        onChange={handleCoverFileChange}
      />
      <Styled.HiddenInput
        ref={logoInputRef}
        type='file'
        accept='image/*'
        onChange={handleLogoFileChange}
      />
    </Styled.BannerArea>
  );
};

export default MobileBannerSection;
