import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { useUpdateClubDetail } from '@/hooks/Queries/useClub';
import { Award, ClubDetail, FAQ, IdealCandidate } from '@/types/club';

const useClubIntroEdit = () => {
  const trackEvent = useMixpanelTrack();
  const clubDetail = useOutletContext<ClubDetail | null>();
  const { mutate: updateClub } = useUpdateClubDetail();
  const queryClient = useQueryClient();

  const [loadedClubId, setLoadedClubId] = useState<string | null>(null);
  const [introDescription, setIntroDescription] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [awards, setAwards] = useState<Award[]>([]);
  const [idealCandidate, setIdealCandidate] = useState<IdealCandidate>({
    tags: [],
    content: '',
  });
  const [benefits, setBenefits] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [initialState, setInitialState] = useState({
    introDescription: '',
    activityDescription: '',
    awards: [] as Award[],
    idealCandidate: { tags: [] as string[], content: '' },
    benefits: '',
    faqs: [] as FAQ[],
  });

  useEffect(() => {
    if (clubDetail?.description && clubDetail.id !== loadedClubId) {
      const desc = clubDetail.description;
      const initial = {
        introDescription: desc.introDescription || '',
        activityDescription: desc.activityDescription || '',
        awards: desc.awards || [],
        idealCandidate: desc.idealCandidate || { tags: [], content: '' },
        benefits: desc.benefits || '',
        faqs: desc.faqs || [],
      };
      setIntroDescription(initial.introDescription);
      setActivityDescription(initial.activityDescription);
      setAwards(initial.awards);
      setIdealCandidate(initial.idealCandidate);
      setBenefits(initial.benefits);
      setFaqs(initial.faqs);
      setInitialState(initial);
      setLoadedClubId(clubDetail.id);
    }
  }, [clubDetail, loadedClubId]);

  const isDirty =
    introDescription !== initialState.introDescription ||
    activityDescription !== initialState.activityDescription ||
    benefits !== initialState.benefits ||
    idealCandidate.content !== initialState.idealCandidate.content ||
    JSON.stringify(awards) !== JSON.stringify(initialState.awards) ||
    JSON.stringify(faqs) !== JSON.stringify(initialState.faqs);

  const handleUpdateClubWithAwards = (newAwards: Award[]) => {
    if (!clubDetail?.id) {
      alert('클럽 정보가 로드되지 않았습니다.');
      return;
    }

    const prevAwards = awards;
    setInitialState((prev) => ({ ...prev, awards: newAwards }));

    updateClub(
      {
        name: clubDetail.name,
        category: clubDetail.category,
        division: clubDetail.division,
        tags: clubDetail.tags,
        introduction: clubDetail.introduction,
        presidentName: clubDetail.presidentName,
        presidentPhoneNumber: clubDetail.presidentPhoneNumber,
        socialLinks: clubDetail.socialLinks,
        description: {
          introDescription,
          activityDescription,
          awards: newAwards,
          idealCandidate,
          benefits,
          faqs,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['clubDetail', clubDetail.id],
          });
        },
        onError: (error) => {
          setInitialState((prev) => ({ ...prev, awards: prevAwards }));
          alert(`수상 내역 수정에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  const handleUpdateClub = () => {
    if (!clubDetail?.id) {
      alert('클럽 정보가 로드되지 않았습니다.');
      return;
    }

    trackEvent(ADMIN_EVENT.UPDATE_CLUB_BUTTON_CLICKED);

    updateClub(
      {
        name: clubDetail.name,
        category: clubDetail.category,
        division: clubDetail.division,
        tags: clubDetail.tags,
        introduction: clubDetail.introduction,
        presidentName: clubDetail.presidentName,
        presidentPhoneNumber: clubDetail.presidentPhoneNumber,
        socialLinks: clubDetail.socialLinks,
        description: {
          introDescription,
          activityDescription,
          awards,
          idealCandidate,
          benefits,
          faqs,
        },
      },
      {
        onSuccess: () => {
          alert('동아리 상세 정보가 성공적으로 수정되었습니다.');
          setInitialState({
            introDescription,
            activityDescription,
            awards,
            idealCandidate,
            benefits,
            faqs,
          });
          queryClient.invalidateQueries({
            queryKey: ['clubDetail', clubDetail.id],
          });
        },
        onError: (error) => {
          alert(`동아리 상세 정보 수정에 실패했습니다: ${error.message}`);
        },
      },
    );
  };

  return {
    clubDetail,
    introDescription,
    setIntroDescription,
    activityDescription,
    setActivityDescription,
    awards,
    setAwards,
    idealCandidate,
    setIdealCandidate,
    benefits,
    setBenefits,
    faqs,
    setFaqs,
    isDirty,
    handleUpdateClub,
    handleUpdateClubWithAwards,
  };
};

export default useClubIntroEdit;
