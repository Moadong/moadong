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
    </S.Container>
  );
};

export default ClubDetailContent;
