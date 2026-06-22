import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import { SNS_CONFIG } from '@/constants/snsConfig';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useUpdateClubDetail } from '@/hooks/Queries/useClub';
import { TAG_COLORS } from '@/styles/clubTags';
import { ClubDetail, SNSPlatform } from '@/types/club';
import { validateSocialLink } from '@/utils/validateSocialLink';

const DIVISION_LABELS: Record<string, string> = {
  중동: '중앙동아리',
  과동: '과동아리',
};

export const divisions = [
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

export const categories = [
  { value: '봉사', label: '봉사', color: TAG_COLORS['봉사'] },
  { value: '종교', label: '종교', color: TAG_COLORS['종교'] },
  { value: '취미교양', label: '취미교양', color: TAG_COLORS['취미교양'] },
  { value: '학술', label: '학술', color: TAG_COLORS['학술'] },
  { value: '운동', label: '운동', color: TAG_COLORS['운동'] },
  { value: '공연', label: '공연', color: TAG_COLORS['공연'] },
];

const useClubInfoEdit = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.CLUB_INFO_EDIT_PAGE);

  const clubDetail = useOutletContext<ClubDetail | null>();
  const { mutate: updateClub } = useUpdateClubDetail();

  const [isDirty, setIsDirty] = useState(false);

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

  // 서버 데이터 로드 시 raw setter 사용 — isDirty를 건드리지 않음
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
      setIsDirty(false);
    }
    if (clubDetail?.socialLinks) {
      setSocialLinks({
        instagram: clubDetail.socialLinks.instagram || '',
        youtube: clubDetail.socialLinks.youtube || '',
        x: clubDetail.socialLinks.x || '',
      });
    }
  }, [clubDetail]);

  // 사용자 입력용 setter — 호출 시 isDirty = true
  const handleSetClubName = (v: string) => {
    setIsDirty(true);
    setClubName(v);
  };
  const handleSetClubPresidentName = (v: string) => {
    setIsDirty(true);
    setClubPresidentName(v);
  };
  const handleSetTelephoneNumber = (v: string) => {
    setIsDirty(true);
    setTelephoneNumber(v);
  };
  const handleSetIntroduction = (v: string) => {
    setIsDirty(true);
    setIntroduction(v);
  };
  const handleSetSelectedDivision = (v: string) => {
    setIsDirty(true);
    setSelectedDivision(v);
  };
  const handleSetSelectedCategory = (v: string) => {
    setIsDirty(true);
    setSelectedCategory(v);
  };
  const handleSetClubTags = (v: string[]) => {
    setIsDirty(true);
    setClubTags(v);
  };
  const handleSetSocialLinks = (
    v: React.SetStateAction<Record<SNSPlatform, string>>,
  ) => {
    setIsDirty(true);
    setSocialLinks(v);
  };

  const handleSocialLinkChange = (key: SNSPlatform, value: string) => {
    const errorMsg = validateSocialLink(key, value);
    setSnsErrors((prev) => ({ ...prev, [key]: errorMsg }));
    setIsDirty(true);
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
      description: clubDetail.description,
    };

    updateClub(updatedData, {
      onSuccess: () => {
        alert('동아리 정보가 성공적으로 수정되었습니다.');
      },
      onError: (error) => {
        alert(`동아리 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

  return {
    clubDetail,
    clubName,
    setClubName: handleSetClubName,
    clubPresidentName,
    setClubPresidentName: handleSetClubPresidentName,
    telephoneNumber,
    setTelephoneNumber: handleSetTelephoneNumber,
    introduction,
    setIntroduction: handleSetIntroduction,
    selectedDivision,
    setSelectedDivision: handleSetSelectedDivision,
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    clubTags,
    setClubTags: handleSetClubTags,
    socialLinks,
    setSocialLinks: handleSetSocialLinks,
    snsErrors,
    setSnsErrors,
    handleSocialLinkChange,
    handleUpdateClub,
    isDirty,
  };
};

export default useClubInfoEdit;
