import { useCallback, useMemo, useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { Award, FAQ, IdealCandidate } from '@/types/club';
import { formatSemesterLabel, getAwardKey } from '@/utils/awardHelpers';
import * as Styled from './ClubIntroContent.styles';

interface ClubIntroContentProps {
  activityDescription?: string;
  awards?: Award[];
  idealCandidate?: IdealCandidate;
  benefits?: string;
  faqs?: FAQ[];
}

const ClubIntroContent = ({
  activityDescription,
  awards,
  idealCandidate,
  benefits,
  faqs,
}: ClubIntroContentProps) => {
  const trackEvent = useMixpanelTrack();

  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(new Set());

  const validAwards = useMemo(
    () => awards?.filter((award) => formatSemesterLabel(award) !== null) || [],
    [awards],
  );

  const handleToggleFaq = useCallback(
    (index: number) => {
      const isOpening = !openFaqIndexes.has(index);

      setOpenFaqIndexes((prev) => {
        const newSet = new Set(prev);
        if (isOpening) newSet.add(index);
        else newSet.delete(index);
        return newSet;
      });

      if (faqs?.[index]) {
        trackEvent(USER_EVENT.FAQ_TOGGLE_CLICKED, {
          question: faqs[index].question,
          action: isOpening ? 'open' : 'close',
        });
      }
    },
    [faqs, trackEvent, openFaqIndexes],
  );

  return (
    <Styled.Container>
      {activityDescription?.trim() && (
        <Styled.Section>
          <Styled.SectionTitle>이런 활동을 해요</Styled.SectionTitle>
          <Styled.TextContainer>
            <Styled.Text>{activityDescription}</Styled.Text>
          </Styled.TextContainer>
        </Styled.Section>
      )}

      {validAwards.length > 0 && (
        <Styled.Section>
          <Styled.SectionTitle>동아리 성과</Styled.SectionTitle>
          <Styled.TextContainer>
            {validAwards.map((award, index) => {
              const semesterLabel = formatSemesterLabel(award)!;
              const awardKey = getAwardKey(award, index);
              return (
                <Styled.AwardGroup key={awardKey}>
                  <Styled.SemesterBadge>{semesterLabel}</Styled.SemesterBadge>
                  <Styled.AwardList>
                    {award.achievements.map((item, idx) => (
                      <Styled.AwardItem key={`${awardKey}-${idx}`}>
                        {item}
                      </Styled.AwardItem>
                    ))}
                  </Styled.AwardList>
                </Styled.AwardGroup>
              );
            })}
          </Styled.TextContainer>
        </Styled.Section>
      )}
      {idealCandidate?.content?.trim() && (
        <Styled.Section>
          <Styled.SectionTitle>이런 사람이 오면 좋아요</Styled.SectionTitle>
          <Styled.TextContainer>
            <Styled.Text>{idealCandidate.content}</Styled.Text>
          </Styled.TextContainer>
        </Styled.Section>
      )}
      {benefits?.trim() && (
        <Styled.Section>
          <Styled.SectionTitle>동아리 부원이 가지는 혜택</Styled.SectionTitle>
          <Styled.TextContainer>
            <Styled.Text>{benefits}</Styled.Text>
          </Styled.TextContainer>
        </Styled.Section>
      )}
      {faqs && faqs.length > 0 && (
        <Styled.FaqSection>
          <Styled.FaqHeader>FAQ</Styled.FaqHeader>
          <Styled.FaqList>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndexes.has(index);
              return (
                <Styled.FaqItem key={faq.question}>
                  <Styled.QuestionRow onClick={() => handleToggleFaq(index)}>
                    <Styled.QuestionText>{faq.question}</Styled.QuestionText>
                    <Styled.ArrowIcon
                      $isOpen={isOpen}
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M6 9L12 15L18 9'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </Styled.ArrowIcon>
                  </Styled.QuestionRow>
                  <Styled.AnswerContainer $isOpen={isOpen}>
                    <Styled.AnswerBox>{faq.answer}</Styled.AnswerBox>
                  </Styled.AnswerContainer>
                </Styled.FaqItem>
              );
            })}
          </Styled.FaqList>
        </Styled.FaqSection>
      )}
    </Styled.Container>
  );
};

export default ClubIntroContent;
