import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ClubDetail } from '@/types/club';
import { SNSPlatform } from '@/types/club';
import { useUpdateClubDetail } from '@/hooks/queries/club/useUpdateClubDetail';
import { validateSocialLink } from '@/utils/validateSocialLink';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useTrackPageView from '@/hooks/useTrackPageView';
import useIsMobileView from '@/hooks/useIsMobileView';
import DesktopClubInfoEditTab from './DesktopClubInfoEditTab';
import MobileClubInfoEditTab from './MobileClubInfoEditTab';

const ClubInfoEditTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.CLUB_INFO_EDIT_PAGE);
  const isMobile = useIsMobileView();

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
  const divisions = ['중동', '과동'];
  const categories = ['봉사', '종교', '취미교양', '학술', '운동', '공연'];

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

  const props = {
    clubName,
    setClubName,
    clubPresidentName,
    setClubPresidentName,
    telephoneNumber,
    setTelephoneNumber,
    introduction,
    setIntroduction,
    selectedDivision,
    setSelectedDivision,
    selectedCategory,
    setSelectedCategory,
    clubTags,
    setClubTags,
    socialLinks,
    handleSocialLinkChange,
    setSocialLinks,
    snsErrors,
    setSnsErrors,
    handleUpdateClub,
    trackEvent,
    divisions,
    categories,
  };

  return isMobile ? (
    <MobileClubInfoEditTab {...props} />
  ) : (
    <DesktopClubInfoEditTab {...props} />
  );
};

export default ClubInfoEditTab;
