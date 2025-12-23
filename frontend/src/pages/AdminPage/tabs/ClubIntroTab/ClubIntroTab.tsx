import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/common/Button/Button';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import { useUpdateClubDetail } from '@/hooks/queries/club/useUpdateClubDetail';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useTrackPageView from '@/hooks/useTrackPageView';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import { ClubDetail } from '@/types/club';
import * as Styled from './ClubIntroTab.styles';
import AwardEditor from './components/AwardEditor/AwardEditor';
import FAQEditor from './components/FAQEditor/FAQEditor';

export interface Award {
  semester: string;
  achievements: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface IdealCandidate {
  tags: string[];
  content: string;
}

const ClubIntroTab = () => {
  const trackEvent = useMixpanelTrack();
  useTrackPageView(PAGE_VIEW.CLUB_INFO_EDIT_PAGE);

  const clubDetail = useOutletContext<ClubDetail | null>();
  const { mutate: updateClub } = useUpdateClubDetail();

  const [introDescription, setIntroDescription] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [awards, setAwards] = useState<Award[]>([]);
  const [idealCandidate, setIdealCandidate] = useState<IdealCandidate>({
    tags: [],
    content: '',
  });
  const [benefits, setBenefits] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (clubDetail) {
      // TODO: API 연동 시 실제 데이터로 대체
      setIntroDescription('');
      setActivityDescription('');
      setAwards([]);
      setIdealCandidate({ tags: [], content: '' });
      setBenefits('');
      setFaqs([]);
    }
  }, [clubDetail]);

  const handleUpdateClub = () => {
    if (!clubDetail?.id) {
      alert('클럽 정보가 로드되지 않았습니다.');
      return;
    }

    trackEvent(ADMIN_EVENT.UPDATE_CLUB_BUTTON_CLICKED);

    const updatedData = {
      id: clubDetail.id,
      introDescription,
      activityDescription,
      awards,
      idealCandidate,
      benefits,
      faqs,
    };

    // TODO: API 연동
    updateClub(updatedData as any, {
      onSuccess: () => {
        alert('동아리 상세 정보가 성공적으로 수정되었습니다.');
        queryClient.invalidateQueries({
          queryKey: ['clubDetail', clubDetail.id],
        });
      },
      onError: (error) => {
        alert(`동아리 상세 정보 수정에 실패했습니다: ${error.message}`);
      },
    });
  };

  return (
    <Styled.Container>
      <ContentSection>
        <ContentSection.Header
          title='상세 정보 수정'
          action={
            <Button width={'150px'} animated onClick={handleUpdateClub}>
              저장하기
            </Button>
          }
        />

        <ContentSection.Body>
          <CustomTextArea
            label={`📝 ${clubDetail?.name || '동아리'}를 소개할게요`}
            placeholder='동아리 소개 문구를 입력해주세요'
            value={introDescription}
            onChange={(e) => setIntroDescription(e.target.value)}
            maxLength={200}
            showMaxChar={true}
          />

          <CustomTextArea
            label='🎯 이런 활동을 해요'
            placeholder='동아리에서 하는 활동 내용을 입력해주세요'
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            maxLength={500}
            showMaxChar={true}
          />

          <AwardEditor awards={awards} onChange={setAwards} />

          <CustomTextArea
            label='💡 이런 사람이 오면 좋아요'
            placeholder='동아리에 어울리는 사람의 특성을 입력해주세요'
            value={idealCandidate.content}
            onChange={(e) =>
              setIdealCandidate({ ...idealCandidate, content: e.target.value })
            }
            maxLength={500}
            showMaxChar={true}
          />

          <CustomTextArea
            label='🎁 부원이 되면 이런 혜택이 있어요'
            placeholder='동아리 부원이 누릴 수 있는 혜택을 입력해주세요'
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            maxLength={500}
            showMaxChar={true}
          />

          <FAQEditor faqs={faqs} onChange={setFaqs} />
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};

export default ClubIntroTab;
