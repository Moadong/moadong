import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/common/Button/Button';
import InputField from '@/components/common/InputField/InputField';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import { SNS_CONFIG } from '@/constants/snsConfig';
import { useUpdateClubDetail } from '@/hooks/queries/club/useUpdateClubDetail';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useTrackPageView from '@/hooks/useTrackPageView';
import ClubLogoEditor from '@/pages/AdminPage/components/ClubLogoEditor/ClubLogoEditor';
import ClubCoverEditor from '@/pages/AdminPage/components/ClubCoverEditor/ClubCoverEditor';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import MakeTags from '@/pages/AdminPage/tabs/ClubInfoEditTab/components/MakeTags/MakeTags';
import SelectTags from '@/pages/AdminPage/tabs/ClubInfoEditTab/components/SelectTags/SelectTags';
import { TAG_COLORS } from '@/styles/clubTags';
import { ClubDetail, SNSPlatform } from '@/types/club';
import { validateSocialLink } from '@/utils/validateSocialLink';
import * as Styled from './ClubInfoEditTab.styles';

const DIVISION_LABELS: Record<string, string> = {
  중동: '중앙동아리',
  과동: '과동아리',
};

const ClubInfoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.CLUB_INFO_EDIT_PAGE);

  const clubDetail = useOutletContext<ClubDetail | null>();
  const { mutate: updateClub } = useUpdateClubDetail();

  const [clubName, setClubName] = useState('');
  const [clubPresidentName, setClubPresidentName] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [clubTags, setClubTags] = useState<string[]>(() => ['', '']);
  const [socialLinks, setSocialLinks] = useState<Record<SNSPlatform, string>>({
    instagram: '',
    youtube: '',
    x: '',
  });

  const [snsErrors, setSnsErrors] = useState<Record<SNSPlatform, string>>({
    instagram: '',
    youtube: '',
    x: '',
  });

  const queryClient = useQueryClient();
  const divisions = [
    {
      value: '중동',
      label: DIVISION_LABELS['중동'],
      color: TAG_COLORS['중동'],
    },
    {
      value: '과동',
      label: DIVISION_LABELS['과동'],
      color: TAG_COLORS['과동'],
    },
  ];
  const categories = [
    { value: '봉사', label: '봉사', color: TAG_COLORS['봉사'] },
    { value: '종교', label: '종교', color: TAG_COLORS['종교'] },
    { value: '취미교양', label: '취미교양', color: TAG_COLORS['취미교양'] },
    { value: '학술', label: '학술', color: TAG_COLORS['학술'] },
    { value: '운동', label: '운동', color: TAG_COLORS['운동'] },
    { value: '공연', label: '공연', color: TAG_COLORS['공연'] },
  ];

  useEffect(() => {
    if (clubDetail) {
      setClubName(clubDetail.name);
      setClubPresidentName(clubDetail.presidentName);
      setTelephoneNumber(clubDetail.presidentPhoneNumber);
      setIntroduction(clubDetail.introduction);
      setSelectedDivision(clubDetail.division);
      setSelectedCategory(clubDetail.category);
      setClubTags(
        clubDetail.tags.length >= 2
          ? clubDetail.tags
          : [...clubDetail.tags, ''],
      );
    }
    if (clubDetail?.socialLinks) {
      setSocialLinks({
        instagram: clubDetail.socialLinks.instagram || '',
        youtube: clubDetail.socialLinks.youtube || '',
        x: clubDetail.socialLinks.x || '',
      });
    }
  }, [clubDetail]);

  const handleSocialLinkChange = (key: SNSPlatform, value: string) => {
    const errorMsg = validateSocialLink(key, value);
    setSnsErrors((prev) => ({ ...prev, [key]: errorMsg }));
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateClub = () => {
    trackEvent(ADMIN_EVENT.UPDATE_CLUB_BUTTON_CLICKED);

    if (!clubDetail || !clubDetail.id) {
      alert('클럽 정보가 로드되지 않았습니다.');
      console.error(
        '[ERROR] clubDetail or clubDetail.id is undefined:',
        clubDetail,
      );
      return;
    }

    const hasSnsErrors = Object.values(snsErrors).some((error) => error !== '');
    if (hasSnsErrors) {
      alert('SNS 링크에 오류가 있어요. 수정 후 다시 시도해주세요!');
      return;
    }

    const updatedData = {
      id: clubDetail.id,
      name: clubName,
      category: selectedCategory,
      division: selectedDivision,
      tags: clubTags,
      introduction: introduction,
      presidentName: clubPresidentName,
      presidentPhoneNumber: telephoneNumber,
      socialLinks: socialLinks,
    };

    updateClub(updatedData, {
      onSuccess: () => {
        alert('동아리 정보가 성공적으로 수정되었습니다.');
        queryClient.invalidateQueries({
          queryKey: ['clubDetail', clubDetail.id],
        });
      },
      onError: (error) => {
        alert(`동아리 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

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
            width='40%'
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
