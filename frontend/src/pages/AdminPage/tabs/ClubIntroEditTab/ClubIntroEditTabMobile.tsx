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
import useAutoGrow from '@/hooks/useAutoGrow';
import MobileSaveButtonArea from '@/pages/AdminPage/components/MobileSaveButtonArea/MobileSaveButtonArea';
import { Award, FAQ, IdealCandidate } from '@/types/club';
import * as Styled from './ClubIntroEditTabMobile.styles';
import AwardSection from './components/mobile/AwardSection/AwardSection';
import FAQSection from './components/mobile/FAQSection/FAQSection';
import InfoSection from './components/mobile/InfoSection/InfoSection';

interface ClubIntroEditTabMobileProps {
  introDescription: string;
  setIntroDescription: (v: string) => void;
  activityDescription: string;
  setActivityDescription: (v: string) => void;
  awards: Award[];
  idealCandidate: IdealCandidate;
  setIdealCandidate: (v: IdealCandidate) => void;
  benefits: string;
  setBenefits: (v: string) => void;
  faqs: FAQ[];
  setFaqs: (v: FAQ[]) => void;
  isDirty: boolean;
  handleUpdateClub: () => void;
}

const ClubIntroEditTabMobile = ({
  introDescription,
  setIntroDescription,
  activityDescription,
  setActivityDescription,
  awards,
  idealCandidate,
  setIdealCandidate,
  benefits,
  setBenefits,
  faqs,
  setFaqs,
  isDirty,
  handleUpdateClub,
}: ClubIntroEditTabMobileProps) => {
  const navigate = useNavigate();
  const introRef = useAutoGrow(introDescription);
  const activityRef = useAutoGrow(activityDescription);
  const idealRef = useAutoGrow(idealCandidate.content);
  const benefitsRef = useAutoGrow(benefits);

  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= INTRO_DESCRIPTION_MAX) {
      setIntroDescription(e.target.value);
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= ACTIVITY_DESCRIPTION_MAX) {
      setActivityDescription(e.target.value);
    }
  };

  const handleIdealChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= IDEAL_CANDIDATE_MAX) {
      setIdealCandidate({ ...idealCandidate, content: e.target.value });
    }
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= BENEFITS_MAX) {
      setBenefits(e.target.value);
    }
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= INTRO_MAX) {
      setIntroDescription(e.target.value);
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= ACTIVITY_MAX) {
      setActivityDescription(e.target.value);
    }
  };

  const handleIdealChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= IDEAL_MAX) {
      setIdealCandidate({ ...idealCandidate, content: e.target.value });
    }
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= BENEFITS_MAX) {
      setBenefits(e.target.value);
    }
  };

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
              <Styled.TextArea
                ref={introRef}
                value={introDescription}
                onChange={handleIntroChange}
                placeholder={INTRO_DESCRIPTION_PLACEHOLDER}
              />
            </InfoSection>

            <InfoSection
              label='이런 활동을 해요'
              maxLength={ACTIVITY_DESCRIPTION_MAX}
              currentLength={activityDescription.length}
            >
              <Styled.TextArea
                ref={activityRef}
                value={activityDescription}
                onChange={handleActivityChange}
                placeholder={ACTIVITY_DESCRIPTION_PLACEHOLDER}
              />
            </InfoSection>

            <AwardSection awards={awards} />

            <InfoSection
              label='이런 사람이 오면 좋아요'
              maxLength={IDEAL_CANDIDATE_MAX}
              currentLength={idealCandidate.content.length}
            >
              <Styled.TextArea
                ref={idealRef}
                value={idealCandidate.content}
                onChange={handleIdealChange}
                placeholder={IDEAL_CANDIDATE_PLACEHOLDER}
              />
            </InfoSection>

            <InfoSection
              label='부원이 되면 이런 혜택이 있어요'
              maxLength={BENEFITS_MAX}
              currentLength={benefits.length}
            >
              <Styled.TextArea
                ref={benefitsRef}
                value={benefits}
                onChange={handleBenefitsChange}
                placeholder={BENEFITS_PLACEHOLDER}
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
