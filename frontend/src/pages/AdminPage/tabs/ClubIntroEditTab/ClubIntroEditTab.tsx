import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useDevice from '@/hooks/useDevice';
import Button from '@/components/common/Button/Button';
import CustomTextArea from '@/components/common/CustomTextArea/CustomTextArea';
import { ContentSection } from '@/pages/AdminPage/components/ContentSection/ContentSection';
import * as Styled from './ClubIntroEditTab.styles';
import ClubIntroEditTabMobile from './ClubIntroEditTabMobile';
import AwardEditor from './components/desktop/AwardEditor/AwardEditor';
import FAQEditor from './components/desktop/FAQEditor/FAQEditor';
import useClubIntroEdit from './hooks/useClubIntroEdit';

const ClubIntroEditTab = () => {
  const { isMobile, isTablet } = useDevice();
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

  if (isMobile || isTablet) {
    return (
      <ClubIntroEditTabMobile
        introDescription={introDescription}
        setIntroDescription={setIntroDescription}
        activityDescription={activityDescription}
        setActivityDescription={setActivityDescription}
        awards={awards}
        idealCandidate={idealCandidate}
        setIdealCandidate={setIdealCandidate}
        benefits={benefits}
        setBenefits={setBenefits}
        faqs={faqs}
        setFaqs={setFaqs}
        isDirty={isDirty}
        handleUpdateClub={handleUpdateClub}
      />
    );
  }

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
            placeholder='동아리 소개 문구를 입력해주세요'
            value={introDescription}
            onChange={(e) => setIntroDescription(e.target.value)}
            maxLength={200}
            showMaxChar={true}
          />

          <CustomTextArea
            variant='filled'
            label='이런 활동을 해요'
            placeholder='동아리에서 하는 활동 내용을 입력해주세요'
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            maxLength={500}
            showMaxChar={true}
          />

          <AwardEditor awards={awards} onChange={setAwards} />

          <CustomTextArea
            variant='filled'
            label='이런 사람이 오면 좋아요'
            placeholder='동아리에 어울리는 사람의 특성을 입력해주세요'
            value={idealCandidate.content}
            onChange={(e) =>
              setIdealCandidate({ ...idealCandidate, content: e.target.value })
            }
            maxLength={500}
            showMaxChar={true}
          />

          <CustomTextArea
            variant='filled'
            label='부원이 되면 이런 혜택이 있어요'
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

export default ClubIntroEditTab;
