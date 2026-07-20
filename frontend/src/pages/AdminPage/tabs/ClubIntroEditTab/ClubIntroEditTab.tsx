import Button from '@/components/common/Button/Button';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
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
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import * as Styled from './ClubIntroEditTab.styles';
import AwardEditor from './components/desktop/AwardEditor/AwardEditor';
import FAQEditor from './components/desktop/FAQEditor/FAQEditor';
import useClubIntroEdit from './hooks/useClubIntroEdit';

const ClubIntroEditTab = () => {
  useTrackPageView(PAGE_VIEW.CLUB_INTRO_EDIT_PAGE);

  const {
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
  } = useClubIntroEdit();

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
            variant='filled'
            label='동아리를 소개할게요'
            placeholder={INTRO_DESCRIPTION_PLACEHOLDER}
            value={introDescription}
            onChange={(e) => setIntroDescription(e.target.value)}
            maxLength={INTRO_DESCRIPTION_MAX}
            showMaxChar={true}
          />

          <CustomTextArea
            variant='filled'
            label='이런 활동을 해요'
            placeholder={ACTIVITY_DESCRIPTION_PLACEHOLDER}
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            maxLength={ACTIVITY_DESCRIPTION_MAX}
            showMaxChar={true}
          />

          <AwardEditor awards={awards} onChange={setAwards} />

          <CustomTextArea
            variant='filled'
            label='이런 사람이 오면 좋아요'
            placeholder={IDEAL_CANDIDATE_PLACEHOLDER}
            value={idealCandidate.content}
            onChange={(e) =>
              setIdealCandidate({ ...idealCandidate, content: e.target.value })
            }
            maxLength={IDEAL_CANDIDATE_MAX}
            showMaxChar={true}
          />

          <CustomTextArea
            variant='filled'
            label='부원이 되면 이런 혜택이 있어요'
            placeholder={BENEFITS_PLACEHOLDER}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            maxLength={BENEFITS_MAX}
            showMaxChar={true}
          />

          <FAQEditor faqs={faqs} onChange={setFaqs} />
        </ContentSection.Body>
      </ContentSection>
    </Styled.Container>
  );
};

export default ClubIntroEditTab;
