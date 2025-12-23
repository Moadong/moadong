import { useState } from 'react';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import * as S from './ClubDetailContent.styles';

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

interface ClubDetailContentProps {
  introDescription?: string;
  activityDescription?: string;
  awards?: Award[];
  idealCandidate?: IdealCandidate;
  benefits?: string;
  faqs?: Faq[];
}

const ClubDetailContent = ({
  introDescription,
  activityDescription,
  awards,
  idealCandidate,
  benefits,
  faqs,
}: ClubDetailContentProps) => {
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
    <S.Container>
      {introDescription && (
        <S.Section>
          <S.Text>{introDescription}</S.Text>
        </S.Section>
      )}

      {activityDescription && (
        <S.Section>
          <S.SectionTitle>이런 활동을 해요</S.SectionTitle>
          <S.TextContainer>
            <S.Text>{activityDescription}</S.Text>
          </S.TextContainer>
        </S.Section>
      )}

      {awards && awards.length > 0 && (
        <S.Section>
          <S.SectionTitle>🏆 동아리 수상</S.SectionTitle>
          <S.TextContainer>
            {awards.map((award, index) => (
              <S.AwardGroup key={index}>
                <S.SemesterBadge>{award.semester}</S.SemesterBadge>
                <S.AwardList>
                  {award.achievements.map((item, idx) => (
                    <S.AwardItem key={idx}>{item}</S.AwardItem>
                  ))}
                </S.AwardList>
              </S.AwardGroup>
            ))}
          </S.TextContainer>
        </S.Section>
      )}

      {idealCandidate && (
        <S.Section>
          <S.SectionTitle>이런 사람이 오면 좋아요</S.SectionTitle>
          <S.TextContainer>
            <S.Text>{idealCandidate.content}</S.Text>
          </S.TextContainer>
        </S.Section>
      )}

      {benefits && (
        <S.Section>
          <S.SectionTitle>동아리 부원이 가지는 혜택</S.SectionTitle>
          <S.TextContainer>
            <S.Text>{benefits}</S.Text>
          </S.TextContainer>
        </S.Section>
      )}

      {faqs && faqs.length > 0 && (
        <S.FaqSection>
          <S.FaqHeader>FAQ</S.FaqHeader>
          <S.FaqList>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndices.includes(index);
              return (
                <S.FaqItem key={index}>
                  <S.QuestionRow onClick={() => handleToggleFaq(index)}>
                    <S.QuestionText>{faq.question}</S.QuestionText>
                    <S.ArrowIcon
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
                    </S.ArrowIcon>
                  </S.QuestionRow>
                  {isOpen && (
                    <S.AnswerContainer>
                      <S.AnswerBox>{faq.answer}</S.AnswerBox>
                    </S.AnswerContainer>
                  )}
                </S.FaqItem>
              );
            })}
          </S.FaqList>
        </S.FaqSection>
      )}
    </S.Container>
  );
};

export default ClubDetailContent;
