import Button from '@/components/common/Button/Button';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import EditField from '@/pages/AdminPage/components/editFields/EditField/EditField';
import NavField from '@/pages/AdminPage/components/editFields/NavField/NavField';
import TextField from '@/pages/AdminPage/components/editFields/TextField/TextField';
import { TAG_COLORS } from '@/styles/clubTags';
import { colors } from '@/styles/theme/colors';
import { ClubDetail, SNSPlatform } from '@/types/club';
import * as Styled from './ClubInfoEditTabMobile.styles';
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
  socialLinks: Record<SNSPlatform, string>;
  handleUpdateClub: () => void;
  isDirty: boolean;
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
  isDirty,
}: ClubInfoEditTabMobileProps) => {
  const trackEvent = useMixpanelTrack();

  const bannerColor = TAG_COLORS[selectedCategory] || colors.gray[400];
  const snsLinkCount = Object.values(socialLinks).filter(
    (link) => link.trim() !== '',
  ).length;
  const filledTags = clubTags.filter((t) => t.trim() !== '');

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar title='기본 정보 수정' />
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
        <Button onClick={handleUpdateClub} disabled={!isDirty}>
          저장하기
        </Button>
      </Styled.SaveButtonArea>
    </>
  );
};

export default ClubInfoEditTabMobile;
