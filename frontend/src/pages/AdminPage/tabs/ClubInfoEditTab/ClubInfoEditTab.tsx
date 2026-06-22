import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import { ADMIN_EVENT } from '@/constants/eventName';
import { SNS_CONFIG } from '@/constants/snsConfig';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import ClubCoverEditor from '@/pages/AdminPage/components/ClubCoverEditor/ClubCoverEditor';
import ClubLogoEditor from '@/pages/AdminPage/components/ClubLogoEditor/ClubLogoEditor';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import MakeTags from '@/pages/AdminPage/tabs/ClubInfoEditTab/components/desktop/MakeTags/MakeTags';
import SelectTags from '@/pages/AdminPage/tabs/ClubInfoEditTab/components/desktop/SelectTags/SelectTags';
import { SNSPlatform } from '@/types/club';
import { divisions, categories } from './hooks/useClubInfoEdit';
import useClubInfoEdit from './hooks/useClubInfoEdit';
import * as Styled from './ClubInfoEditTab.styles';

const ClubInfoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  const {
    clubDetail,
    clubName,
    setClubName,
    introduction,
    setIntroduction,
    selectedDivision,
    setSelectedDivision,
    selectedCategory,
    setSelectedCategory,
    clubTags,
    setClubTags,
    socialLinks,
    setSocialLinks,
    snsErrors,
    setSnsErrors,
    handleSocialLinkChange,
    handleUpdateClub,
  } = useClubInfoEdit();

  return (
    <Styled.Container>
      <ContentSection>
        <ContentSection.Header
          title='기본 정보 수정'
          action={
            <Button width={'150px'} animated onClick={handleUpdateClub}>
              저장하기
            </Button>
          }
        />

        <ContentSection.Body>
          <ClubLogoEditor clubLogo={clubDetail?.logo} />
          <ClubCoverEditor coverImage={clubDetail?.cover} />
          <InputField
            label='동아리명'
            placeholder='동아리명'
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            onClear={() => {
              trackEvent(ADMIN_EVENT.CLUB_NAME_CLEAR_BUTTON_CLICKED);
              setClubName('');
            }}
            width='50%'
            maxLength={20}
            showMaxChar={true}
          />

          <InputField
            label='한줄소개'
            placeholder='한줄소개를 입력해주세요'
            type='text'
            maxLength={20}
            showMaxChar={true}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            onClear={() => {
              trackEvent(ADMIN_EVENT.CLUB_INTRODUCTION_CLEAR_BUTTON_CLICKED);
              setIntroduction('');
            }}
          />

          <SelectTags
            label='분류'
            tags={divisions}
            selected={selectedDivision}
            onChange={setSelectedDivision}
          />

          <SelectTags
            label='분과'
            tags={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />

          <MakeTags value={clubTags} onChange={setClubTags} />
        </ContentSection.Body>
      </ContentSection>

      <ContentSection>
        <ContentSection.Header title='동아리 SNS 연결' />

        <ContentSection.Body>
          {Object.entries(SNS_CONFIG).map(
            ([rawKey, { label, placeholder }]) => {
              const key = rawKey as SNSPlatform;

              return (
                <Styled.SNSRow key={key}>
                  <Styled.SNSLabel>{label}</Styled.SNSLabel>
                  <InputField
                    placeholder={placeholder}
                    value={socialLinks[key]}
                    onChange={(e) =>
                      handleSocialLinkChange(key, e.target.value)
                    }
                    onClear={() => {
                      trackEvent(
                        ADMIN_EVENT.CLUB_SNS_LINK_CLEAR_BUTTON_CLICKED,
                        {
                          snsPlatform: label,
                        },
                      );
                      setSocialLinks((prev) => ({ ...prev, [key]: '' }));
                      setSnsErrors((prev) => ({ ...prev, [key]: '' }));
                    }}
                    isError={snsErrors[key] !== ''}
                    helperText={snsErrors[key]}
                  />
                </Styled.SNSRow>
              );
            },
          )}
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};

export default ClubInfoEditTab;
