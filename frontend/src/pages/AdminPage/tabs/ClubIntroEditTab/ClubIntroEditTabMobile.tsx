import { useNavigate } from 'react-router-dom';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
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

const INTRO_MAX = 300;
const ACTIVITY_MAX = 300;
const IDEAL_MAX = 300;
const BENEFITS_MAX = 300;

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
              maxLength={INTRO_MAX}
              currentLength={introDescription.length}
            >
              <Styled.TextArea
                value={introDescription}
                onChange={(e) => {
                  if (e.target.value.length <= INTRO_MAX) {
                    setIntroDescription(e.target.value);
                  }
                }}
                placeholder='동아리 소개 문구를 입력해주세요'
              />
            </InfoSection>

            <InfoSection
              label='이런 활동을 해요'
              maxLength={ACTIVITY_MAX}
              currentLength={activityDescription.length}
            >
              <Styled.TextArea
                value={activityDescription}
                onChange={(e) => {
                  if (e.target.value.length <= ACTIVITY_MAX) {
                    setActivityDescription(e.target.value);
                  }
                }}
                placeholder='동아리에서 하는 활동 내용을 입력해주세요'
              />
            </InfoSection>

            <AwardSection awards={awards} />

            <InfoSection
              label='이런 사람이 오면 좋아요'
              maxLength={IDEAL_MAX}
              currentLength={idealCandidate.content.length}
            >
              <Styled.TextArea
                value={idealCandidate.content}
                onChange={(e) => {
                  if (e.target.value.length <= IDEAL_MAX) {
                    setIdealCandidate({
                      ...idealCandidate,
                      content: e.target.value,
                    });
                  }
                }}
                placeholder='동아리에 어울리는 사람의 특성을 입력해주세요'
              />
            </InfoSection>

            <InfoSection
              label='부원이 되면 이런 혜택이 있어요'
              maxLength={BENEFITS_MAX}
              currentLength={benefits.length}
            >
              <Styled.TextArea
                value={benefits}
                onChange={(e) => {
                  if (e.target.value.length <= BENEFITS_MAX) {
                    setBenefits(e.target.value);
                  }
                }}
                placeholder='동아리 부원이 누릴 수 있는 혜택을 입력해주세요'
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
