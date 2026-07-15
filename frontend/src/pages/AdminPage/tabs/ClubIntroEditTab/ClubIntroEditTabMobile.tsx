import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  ACTIVITY_DESCRIPTION_MAX,
  BENEFITS_MAX,
  IDEAL_CANDIDATE_MAX,
  INTRO_DESCRIPTION_MAX,
} from '@/constants/adminFieldLimits';
import {
  ACTIVITY_DESCRIPTION_PLACEHOLDER,
  BENEFITS_PLACEHOLDER,
  IDEAL_CANDIDATE_PLACEHOLDER,
  INTRO_DESCRIPTION_PLACEHOLDER,
} from '@/constants/adminFieldPlaceholders';
import ClearableTextArea from '@/pages/AdminPage/components/ClearableTextArea/ClearableTextArea';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import { Award, FAQ, IdealCandidate } from '@/types/club';
import * as Styled from './ClubIntroEditTabMobile.styles';
import AwardEditPage from './components/mobile/AwardEditPage/AwardEditPage';
import AwardSection from './components/mobile/AwardSection/AwardSection';
import FAQSection from './components/mobile/FAQSection/FAQSection';
import InfoSection from './components/mobile/InfoSection/InfoSection';

interface ClubIntroEditTabMobileProps {
  introDescription: string;
  setIntroDescription: (v: string) => void;
  activityDescription: string;
  setActivityDescription: (v: string) => void;
  awards: Award[];
  setAwards: (awards: Award[]) => void;
  idealCandidate: IdealCandidate;
  setIdealCandidate: (v: IdealCandidate) => void;
  benefits: string;
  setBenefits: (v: string) => void;
  faqs: FAQ[];
  setFaqs: (v: FAQ[]) => void;
  isDirty: boolean;
  handleUpdateClub: () => void;
  handleUpdateClubWithAwards: (awards: Award[]) => void;
}

type ActivePage = 'main' | 'award';

const ClubIntroEditTabMobile = ({
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
}: ClubIntroEditTabMobileProps) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<ActivePage>('main');

  const handleIdealCandidateChange = (value: string) =>
    setIdealCandidate({ ...idealCandidate, content: value });

  if (activePage === 'award') {
    return (
      <AwardEditPage
        initialAwards={awards}
        onSave={setAwards}
        onSaveToServer={handleUpdateClubWithAwards}
        onBack={() => setActivePage('main')}
      />
    );
  }

  return (
    <>
      <Styled.MobileContainer>
        <WebviewTopBar
          title='상세 정보 수정'
          onBack={() => navigate('/admin')}
        />

        <Styled.FormSection>
          <Styled.PageTitle>동아리 상세 정보를 입력해주세요</Styled.PageTitle>
          <Styled.PageSubtitle>
            지원자가 가장 먼저 확인하는 소개글이에요
          </Styled.PageSubtitle>

          <Styled.FieldList>
            <InfoSection
              label='동아리를 소개할게요'
              maxLength={INTRO_DESCRIPTION_MAX}
              currentLength={introDescription.length}
            >
              <ClearableTextArea
                value={introDescription}
                onChange={setIntroDescription}
                placeholder={INTRO_DESCRIPTION_PLACEHOLDER}
                maxLength={INTRO_DESCRIPTION_MAX}
              />
            </InfoSection>

            <InfoSection
              label='이런 활동을 해요'
              maxLength={ACTIVITY_DESCRIPTION_MAX}
              currentLength={activityDescription.length}
            >
              <ClearableTextArea
                value={activityDescription}
                onChange={setActivityDescription}
                placeholder={ACTIVITY_DESCRIPTION_PLACEHOLDER}
                maxLength={ACTIVITY_DESCRIPTION_MAX}
              />
            </InfoSection>

            <AwardSection
              awards={awards}
              onNavigate={() => setActivePage('award')}
            />

            <InfoSection
              label='이런 사람이 오면 좋아요'
              maxLength={IDEAL_CANDIDATE_MAX}
              currentLength={idealCandidate.content.length}
            >
              <ClearableTextArea
                value={idealCandidate.content}
                onChange={handleIdealCandidateChange}
                placeholder={IDEAL_CANDIDATE_PLACEHOLDER}
                maxLength={IDEAL_CANDIDATE_MAX}
              />
            </InfoSection>

            <InfoSection
              label='부원이 되면 이런 혜택이 있어요'
              maxLength={BENEFITS_MAX}
              currentLength={benefits.length}
            >
              <ClearableTextArea
                value={benefits}
                onChange={setBenefits}
                placeholder={BENEFITS_PLACEHOLDER}
                maxLength={BENEFITS_MAX}
              />
            </InfoSection>

            <FAQSection faqs={faqs} onChange={setFaqs} />
          </Styled.FieldList>
        </Styled.FormSection>
      </Styled.MobileContainer>

      <MobileSaveButtonArea onClick={handleUpdateClub} disabled={!isDirty} />
    </>
  );
};

export default ClubIntroEditTabMobile;
