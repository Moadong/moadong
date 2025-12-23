import { useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as Styled from './ClubIntroContent.styles';

export interface Award {
  semester: string;
  achievements: string[];
}

export interface IdealCandidate {
  tags?: string[]; // TODO: tags가 추가될수도 있음
  content: string;
}

export interface Faq {
  question: string;
  answer: string;
}

interface ClubIntroContentProps {
  activityDescription?: string;
  awards?: Award[];
  idealCandidate?: IdealCandidate;
  benefits?: string;
  faqs?: Faq[];
}

const ClubIntroContent = ({
  activityDescription,
  awards,
  idealCandidate,
  benefits,
  faqs,
}: ClubIntroContentProps) => {
  const trackEvent = useMixpanelTrack();

  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([]);

  const handleToggleFaq = (index: number) => {
    const isOpening = !openFaqIndices.includes(index);
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );

    if (faqs && faqs[index]) {
      trackEvent(USER_EVENT.FAQ_TOGGLE_CLICKED, {
        question: faqs[index].question,
        action: isOpening ? 'open' : 'close',
      });
    }
  };

  return (
    <Styled.Container>
      {activityDescription && (
        <Styled.Section>
          <Styled.SectionTitle>이런 활동을 해요</Styled.SectionTitle>
          <Styled.TextContainer>
            <Styled.Text>{activityDescription}</Styled.Text>
          </Styled.TextContainer>
        </Styled.Section>
      )}
      {awards && awards.length > 0 && (
        <Styled.Section>
          <Styled.SectionTitle>🏆 동아리 수상</Styled.SectionTitle>
          <Styled.TextContainer>
            {awards.map((award) => (
              <Styled.AwardGroup key={award.semester}>
                <Styled.SemesterBadge>{award.semester}</Styled.SemesterBadge>
                <Styled.AwardList>
                  {award.achievements.map((item, idx) => (
                    <Styled.AwardItem key={`${award.semester}-${idx}`}>
                      {item}
                    </Styled.AwardItem>
                  ))}
                </Styled.AwardList>
              </Styled.AwardGroup>
            ))}
          </Styled.TextContainer>
        </Styled.Section>
      )}

      {idealCandidate && (
        <Styled.Section>
          <Styled.SectionTitle>이런 사람이 오면 좋아요</Styled.SectionTitle>
          <Styled.TextContainer>
            <Styled.Text>{idealCandidate.content}</Styled.Text>
          </Styled.TextContainer>
        </Styled.Section>
      )}

      {benefits && (
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
              const isOpen = openFaqIndices.includes(index);
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
                  {isOpen && (
                    <Styled.AnswerContainer>
                      <Styled.AnswerBox>{faq.answer}</Styled.AnswerBox>
                    </Styled.AnswerContainer>
                  )}
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
