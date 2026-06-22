import { useRef } from 'react';
import Button from '@/components/common/Button/Button';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import LogoEditIcon from '@/assets/images/icons/logo_edit_icon.svg?react';
import defaultLogo from '@/assets/images/logos/default_profile_image.svg';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useDeleteCover, useUploadCover } from '@/hooks/Queries/useClubCover';
import { useUploadLogo } from '@/hooks/Queries/useClubImages';
import EditField from '@/pages/AdminPage/components/editFields/EditField/EditField';
import NavField from '@/pages/AdminPage/components/editFields/NavField/NavField';
import TextField from '@/pages/AdminPage/components/editFields/TextField/TextField';
import { useAdminClubId } from '@/store/useAdminClubStore';
import { colors } from '@/styles/theme/colors';
import { TAG_COLORS } from '@/styles/clubTags';
import { ClubDetail, SNSPlatform } from '@/types/club';
import { categories } from './hooks/useClubInfoEdit';
import * as Styled from './ClubInfoEditTabMobile.styles';

interface ClubInfoEditTabMobileProps {
  clubDetail: ClubDetail | null;
  clubName: string;
  setClubName: (v: string) => void;
  introduction: string;
  setIntroduction: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  clubTags: string[];
  socialLinks: Record<SNSPlatform, string>;
  handleUpdateClub: () => void;
}

const ClubInfoEditTabMobile = ({
  clubDetail,
  clubName,
  setClubName,
  introduction,
  setIntroduction,
  selectedCategory,
  setSelectedCategory,
  clubTags,
  socialLinks,
  handleUpdateClub,
}: ClubInfoEditTabMobileProps) => {
  const trackEvent = useMixpanelTrack();
  const { clubId } = useAdminClubId();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadCover } = useUploadCover();
  const { mutate: deleteCover } = useDeleteCover();
  const { mutate: uploadLogo } = useUploadLogo();

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clubId) return;
    uploadCover({ clubId, file });
    e.target.value = '';
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clubId) return;
    uploadLogo({ clubId, file });
    e.target.value = '';
  };

  const coverUrl = clubDetail?.cover;
  const logoUrl = clubDetail?.logo;
  const bannerColor = TAG_COLORS[selectedCategory] || colors.gray[400];

  const snsLinkCount = Object.values(socialLinks).filter(
    (link) => link.trim() !== '',
  ).length;

  const filledTags = clubTags.filter((t) => t.trim() !== '');

  return (
    <>
    <Styled.MobileContainer>
      <WebviewTopBar title='기본 정보 수정' />
      <Styled.BannerArea $bgColor={bannerColor}>
        {coverUrl && <Styled.CoverImage src={coverUrl} alt='커버 이미지' />}
        <Styled.BannerButtonGroup>
          <Styled.BannerEditButton onClick={() => coverInputRef.current?.click()}>
            배너 수정
          </Styled.BannerEditButton>
          {coverUrl && (
            <Styled.BannerEditButton
              onClick={() => {
                if (!clubId) return;
                deleteCover(clubId);
              }}
            >
              초기화
            </Styled.BannerEditButton>
          )}
        </Styled.BannerButtonGroup>

        <Styled.LogoWrapper>
          <Styled.LogoImage
            src={logoUrl || defaultLogo}
            alt='동아리 로고'
            onClick={() => logoInputRef.current?.click()}
          />
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

      <Styled.FormSection>
        <TextField
          label='동아리명'
          placeholder='동아리명을 입력해주세요.'
          value={clubName}
          onChange={setClubName}
          onClear={() => {
            trackEvent(ADMIN_EVENT.CLUB_NAME_CLEAR_BUTTON_CLICKED);
            setClubName('');
          }}
        />

        <TextField
          label='동아리소개'
          placeholder='한줄소개를 입력해주세요.'
          value={introduction}
          onChange={setIntroduction}
          onClear={() => {
            trackEvent(ADMIN_EVENT.CLUB_INTRODUCTION_CLEAR_BUTTON_CLICKED);
            setIntroduction('');
          }}
        />

        <EditField label='분과'>
          <Styled.TagList>
            {categories.map((tag) => (
              <Styled.TagPill
                key={tag.value}
                $isSelected={selectedCategory === tag.value}
                $color={tag.color}
                onClick={() => setSelectedCategory(tag.value)}
              >
                {tag.label}
              </Styled.TagPill>
            ))}
          </Styled.TagList>
        </EditField>

        <NavField
          label='자유태그 (5자이내)'
          onNavigate={() => {
            trackEvent(ADMIN_EVENT.TAB_CLICKED, {
              tabName: '자유태그 수정',
            });
          }}
        >
          {filledTags.length > 0 ? (
            <Styled.TagList>
              {filledTags.map((tag, i) => (
                <Styled.FreeTagPill key={i}>{`#${tag}`}</Styled.FreeTagPill>
              ))}
            </Styled.TagList>
          ) : (
            <Styled.NavFieldContent>없음</Styled.NavFieldContent>
          )}
        </NavField>

        <NavField
          label='링크 추가'
          onNavigate={() => {
            trackEvent(ADMIN_EVENT.TAB_CLICKED, {
              tabName: '링크 추가',
            });
          }}
        >
          {snsLinkCount > 0 ? (
            <Styled.CountText>{snsLinkCount}</Styled.CountText>
          ) : (
            <Styled.NavFieldContent>없음</Styled.NavFieldContent>
          )}
        </NavField>
      </Styled.FormSection>
    </Styled.MobileContainer>

    <Styled.SaveButtonArea>
      <Button animated onClick={handleUpdateClub}>
        저장하기
      </Button>
    </Styled.SaveButtonArea>
  </>
  );
};

export default ClubInfoEditTabMobile;
