import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import EditField from '@/pages/AdminPage/components/editFields/EditField/EditField';
import NavField from '@/pages/AdminPage/components/editFields/NavField/NavField';
import TextField from '@/pages/AdminPage/components/editFields/TextField/TextField';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import { TAG_COLORS } from '@/styles/clubTags';
import { colors } from '@/styles/theme/colors';
import { ClubDetail, SNSPlatform } from '@/types/club';
import * as Styled from './ClubInfoEditTabMobile.styles';
import FreeTagEditPage from './components/mobile/FreeTagEditPage/FreeTagEditPage';
import LinkEditPage from './components/mobile/LinkEditPage/LinkEditPage';
import MobileBannerSection from './components/mobile/MobileBannerSection/MobileBannerSection';
import { categories } from './hooks/useClubInfoEdit';

interface ClubInfoEditTabMobileProps {
  clubDetail: ClubDetail | null;
  clubName: string;
  setClubName: (v: string) => void;
  introduction: string;
  setIntroduction: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  clubTags: string[];
  setClubTags: (tags: string[]) => void;
  socialLinks: Record<SNSPlatform, string>;
  onSocialLinksChange: (links: { instagram: string; youtube: string }) => void;
  handleUpdateClub: () => void;
  handleUpdateClubWithLinks: (links: {
    instagram: string;
    youtube: string;
  }) => void;
  handleUpdateClubWithTags: (newTags: string[]) => void;
  isDirty: boolean;
}

type ActivePage = 'main' | 'freeTags' | 'links';

const ClubInfoEditTabMobile = ({
  clubDetail,
  clubName,
  setClubName,
  introduction,
  setIntroduction,
  selectedCategory,
  setSelectedCategory,
  clubTags,
  setClubTags,
  socialLinks,
  onSocialLinksChange,
  handleUpdateClub,
  handleUpdateClubWithLinks,
  handleUpdateClubWithTags,
  isDirty,
}: ClubInfoEditTabMobileProps) => {
  const navigate = useNavigate();
  const trackEvent = useMixpanelTrack();
  const [activePage, setActivePage] = useState<ActivePage>('main');

  const bannerColor = TAG_COLORS[selectedCategory] || colors.gray[400];
  const snsLinkCount = (['instagram', 'youtube'] as const).filter(
    (key) => socialLinks[key].trim() !== '',
  ).length;
  const filledTags = clubTags.filter((t) => t.trim() !== '');

  if (activePage === 'freeTags') {
    return (
      <FreeTagEditPage
        initialTags={clubTags}
        onSave={setClubTags}
        onSaveToServer={handleUpdateClubWithTags}
        onBack={() => setActivePage('main')}
      />
    );
  }

  if (activePage === 'links') {
    return (
      <LinkEditPage
        initialLinks={{
          instagram: socialLinks.instagram,
          youtube: socialLinks.youtube,
        }}
        onSave={onSocialLinksChange}
        onSaveToServer={handleUpdateClubWithLinks}
        onBack={() => setActivePage('main')}
      />
    );
  }

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar
          title='기본 정보 수정'
          onBack={() => navigate('/admin')}
        />
        <MobileBannerSection
          coverUrl={clubDetail?.cover}
          logoUrl={clubDetail?.logo}
          bannerColor={bannerColor}
        />

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
              trackEvent(ADMIN_EVENT.TAB_CLICKED, { tabName: '자유태그' });
              setActivePage('freeTags');
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
              trackEvent(ADMIN_EVENT.TAB_CLICKED, { tabName: '링크 추가' });
              setActivePage('links');
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

      <MobileSaveButtonArea onClick={handleUpdateClub} disabled={!isDirty} />
    </>
  );
};

export default ClubInfoEditTabMobile;
